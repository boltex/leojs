# Converting the new Leo Editor Undo API to LeoJS

Edward has changed the undo API.

It's using the 'with' python keyword. This makes it cleaner and more concise than the old way of using the undo class, wich used two 'before-X' and 'after-X' dedicated methods.

The first step for LeoJS is to make the equivalent of leoUndo.py source into its equivalent in typescript. Going everywhere else in the code to change the actual calls to that undo API is trivial and can be done afterwards.

# The new undo API

All undoable code exists within contexts created by "with" statements. Contexts handle all the details of doing, undoing and redoing an operation. See the source code for details.

There are three main contexts. Use the most specific context possible.

The examples below all assume the following definitions:

```Python
p = c.p
u = c.undoer
w = c.frame.body.wrapper
```

## with u.move_node(p, ‘command-name’):

Use the u.move_node context if your command only moves a single node p:

```Python
with u.move_node(p, 'command-name'):
    p.setDirty()  # Calls p.v.setAllAncestorAtFileNodesDirty().
    # move the node
    p.setDirty()  # p.v.setAllAncestorAtFileNodesDirty() again.
    # call w.setInsertPoint() or w.setSelectionRange() as desired.
    c.p = p
    # Do *not* call c.redraw!
```

## with u.change_node(p, ‘command-name’):

Use the u.change_node context if your command only changes a single node p:

```Python
with u.change_node(p, 'command-name'):
    # change p.b or p.h or both.
    # call p.setDirty(), p.setMarked() or p.clearMarked() as desired.
    # call w.setInsertPoint() or w.setSelectionRange() as desired.
    # Do *not* call c.redraw!
```

## with u.change_outline(‘command-name’):

Finally, use the u.change_outline context for all other (more complex) changes:

```Python
with u.change_outline('command-name'):
    # make *arbitrary* changes to the outline.
    # set c.p if it changes.
    # call w.setInsertPoint() or w.setSelectionRange() as desired.
    # Do *not* call c.redraw!
```

# From Python to Typescript

This is an interesting case, because the new Python Undoer class is using two different kinds of context managers, and there's an important distinction when translating them to TypeScript for LeoJS.

I've looked through the class, and I think you can reproduce its behavior quite elegantly using TypeScript's "using" keyword, and Symbol.dispose, without having to reproduce Python's generator machinery.

## There are two mechanisms at work

The Python class defines a context manager directly through:

```Python
def __enter__(self) -> Self:
    u = self
    if u.undoBeadLevel == 0:
        u.undoBead = UndoBead(u)
    u.undoBeadLevel += 1
    assert u.undoBead
    return u
```

And the matching `__exit__():`

```Python
def __exit__(self, exc_type, exc_value, traceback):
    u = self
    b = u.undoBead
    assert b
    u.undoBeadLevel -= 1
    if u.undoBeadLevel:
        return
    u.undoBead = None
    if b.undo_functions and not (u.undoing or u.redoing):
        if not b.command_name:
            raise AssertionError("Missing call to u.set_command_name")
        u.pushBead(b)
```

This allows:

```Python
with u:
    # Multiple changes collected into one undo bead.
```

The second mechanism is the @contextmanager decorator, used by three methods:

- change_node
- change_outline
- move_node

These methods create specialized contexts that capture state before the operation, execute user code at yield, and capture the resulting state afterward.

The crucial difference is that with u handles the undo transaction, while the decorated methods handle particular types of changes within that transaction.

## How I'd translate the basic with u

I wouldn't implement [Symbol.dispose]() directly on the Undoer instance, because the same Undoer is reused for many operations, and contexts can be nested.

Instead, I'd make a factory method returning a disposable scope.

```Typescript
class Undoer {
    public undoBeadLevel = 0;
    public undoBead?: UndoBead;

    public begin(): Disposable {
        if (this.undoBeadLevel === 0) {
            this.undoBead = new UndoBead(this);
        }

        this.undoBeadLevel++;

        return {
            [Symbol.dispose]: () => {
                const b = this.undoBead!;

                this.undoBeadLevel--;

                if (this.undoBeadLevel > 0) {
                    return;
                }

                this.undoBead = undefined;

                if (b.undo_functions.length &&
                    !this.undoing && !this.redoing) {

                    if (!b.command_name) {
                        throw new Error("Missing command name");
                    }

                    this.pushBead(b);
                }
            }
        };
    }
}
```

Now, where Python has:

```Python
with u:
    u.set_command_name("Insert Node")
    u.insert_node(p)
```

TypeScript becomes:

```Typescript
{
    using scope = u.begin();

    u.set_command_name("Insert Node");
    u.insert_node(p);
}
```

And nested scopes naturally work because undoBeadLevel tracks their depth.

One important detail: using performs cleanup at the end of its enclosing lexical scope, not immediately after the last use of the variable. Explicit braces are useful for defining the exact transaction boundary.

### Translating @contextmanager methods

Here's where it gets more interesting.

Consider the Python implementation of change_node:

```Python
@contextmanager
def change_node(self, p, command_name):
    ...
    with u:
        u.set_command_name(command_name)

        old_state = u.capture_node(p.v)
        old_ui = u.capture_ui()

        try:
            yield u
        finally:
            new_state = u.capture_node(p.v)
            # Register undo/redo functions.
```

Python uses yield to suspend the generator while the caller performs its modifications.

You don't actually need generators in TypeScript to achieve this.

You can replace the code before yield with a scope's initialization, and the code after yield with its disposal.

I would recommend a small helper:

```Typescript
function onDispose(callback: () => void): Disposable {
    return {
        [Symbol.dispose]: callback
    };
}
```

Then the TypeScript version of change_node could follow this structure:

```Typescript
public changeNode(p: Position, commandName: string): Disposable {
    const u = this;
    const c = u.c;

    if (u.undoing || u.redoing) {
        return onDispose(() => {});
    }

    if (!c.changed) {
        c.setChanged();
    }

    const scope = new DisposableStack();

    // The underlying undo transaction.
    scope.use(u.begin());

    try {
        u.setCommandName(commandName);

        if (u.captureLevel > 0 || u.nodeCaptures.has(p.v)) {
            return scope;
        }

        const oldP = c.p.copy();
        const oldState = u.captureNode(p.v);
        const oldUI = u.captureUI();

        u.nodeCaptures.add(p.v);

        // This runs BEFORE u.begin() is disposed.
        scope.defer(() => {
            try {
                const newP = c.p;
                const newState = u.captureNode(p.v);

                if (!statesEqual(oldState, newState)) {
                    u.redraw(newP);

                    const newUI = u.captureUI();
                    const bead = u.undoBead!;

                    bead.addHelpers(
                        () => u.restoreNode(p.v, newState),
                        () => u.restoreNode(p.v, oldState)
                    );

                    bead.addFinishers(
                        () => {
                            u.restoreUI(newUI);
                            u.redraw(newP);
                        },
                        () => {
                            u.restoreUI(oldUI);
                            u.redraw(oldP);
                        }
                    );
                }
            } finally {
                u.nodeCaptures.delete(p.v);
            }
        });

        return scope;
    } catch (error) {
        scope.dispose();
        throw error;
    }
}
```

The nice part is that DisposableStack executes the cleanup operations in reverse registration order.

That means the finalization of changeNode() happens before the surrounding undo transaction is disposed of, exactly as in Python.

### Usage

Python:

```Python
with c.undoer.change_node(p, "Change Headline"):
    p.h = "New Headline"
    p.b = "New Body"
```

TypeScript:

```Typescript
{
    using change = c.undoer.changeNode(p, "Change Headline");

    p.h = "New Headline";
    p.b = "New Body";
}
```

Pretty close!

####
