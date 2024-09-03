---
sidebar_position: 2
---

# Writing Plugins

Plugins modify how Leo works. With plugins you can give Leo new commands,
modify how existing commands work, or change any other aspect of Leo's look
and feel.

1. Plugins can use any of Leo's source code simply by accessing the g global module.

2. Plugins can register event handlers just like any other Leo script. For full
   details, see the section called [Handling Events](#handling-events) later in this chapter.

The rest of this chapters discusses topics related specifically to plugins.

## How to create a plugin

A LeoJS plugin is a VSCode Extensions that uses the API LeoJS exposes.

See the [LeoJS Access Sample Extension](https://github.com/boltex/extension-sample-leojs) for more information on how to create a plugin for LeoJS. This sample extension shows how to access and use LeoJS from another extension through its exposed instance of the leoGlobals 'g' object:

```ts
const extension = vscode.extensions.getExtension('boltex.leojs');
const g = await extension.activate();
```

## c ivars & properties


For any commander c:

| Property                     | Value                                      |
|:-----------------------------|:-------------------------------------------|
| c.p                          | the presently selected position            |
| c.frame                      | the leoFrame representing the main window. |
| c.frame.body                 | a NullBody representing the body pane.     |
| c.frame.body.wrapper         | a StringTextWrapper.                       |
| c.frame.tree                 | a NullTree, representing the tree pane     |
| c.user_dict                  | a dictionary for use by scripts and plugins.<br></br>Does not persist when Leo exists. |

## Handling events

Plugins and other scripts can register event handlers (also known as hooks):

```js
g.registerHandler("after-create-leo-frame", onCreate)
g.registerHandler("idle", on_idle) 
g.registerHandler(("start2", "open2", "command2"), create_open_with_menu) 
```

As shown above, a plugin may register one or more event handlers with a single call to g.registerHandler. Once a hook is registered, Leo will call the registered function' at the named **hook time**. For example:

```js
g.registerHandler("idle", on_idle)
```

causes Leo to call on_idle at "idle" time.

Event handlers must have the following signature:

```js
function myHook (tag: string, keywords: Record<string, any>): any {
    // whatever
}
```

- tag is the name of the hook (a string).
- keywords is a dictionary containing additional information. The following section describes the contents of the keywords dictionary in detail.

### Summary of event handlers

The following table tells about each event handler: its name, when it is called,
and the additional arguments passed to the hook in the keywords dictionary.

> 📌 **NOTE**\
> For some kind of hooks, Leo will skip its own normal processing if the hook 
> returns anything *other* than None. The table indicates such hooks with 🛑 in
> the **Stop?** column.


| Event name                     | Stop?  | When                               | Keys in keywords dict
|:-------------------------------|:-------|:-----------------------------------|:----------------------------
| 'after-auto'                   |        | after each @auto file loaded       | c,p (note 5)
| 'after-create-leo-frame'       |        | after creating any frame           | c
| 'after-redraw-outline'         |        | end of tree.redraw                 | c (note 4)
| 'after-reading-external-file'  |        | after reading each external file   | c,p
| 'after-reload-settings'        |        | after 'reload-settings' command    | c
| 'before-create-leo-frame'      |        | before frame.finishCreate          | c
| 'before-writing-external-file' |        | before writing each external file  | c,p
| 'bodykey1'                     | 🛑     | before body keystrokes             | c,p,v,ch,oldSel,undoType
| 'bodykey2'                     |        | after  body keystrokes             | c,p,v,ch,oldSel,undoType
| 'clear-all-marks'              |        | after clear-all-marks command      | c,p,v
| 'clear-mark'                   |        | when mark is set                   | c,p,v
| 'close-frame'                  |        | in app.closeLeoWindow              | c (note 3)
| 'command1'                     | 🛑     | before each command                | c,p,v,label (note 1)
| 'command2'                     |        | after  each command                | c,p,v,label (note 1)
| 'end1'                         |        | start of app.quit()                | None
| 'headclick1'                   | 🛑     | before normal click in headline    | c,p,v,event
| 'headclick2'                   |        | after  normal click in headline    | c,p,v,event
| 'headkey1'                     | 🛑     | before headline keystrokes         | c,p,v,ch (note 4)
| 'headkey2'                     |        | after  headline keystrokes         | c,p,v,ch (note 4)
| 'hoist-changed'                |        | whenever the hoist stack changes   | c
| 'idle'                         |        | periodically (at idle time)        | c
| 'new'                          |        | start of New command               | c,old_c
| 'open1'                        | 🛑     | before opening any file            | c,old_c,fileName (note 2)
| 'open2'                        |        | after  opening any file            | c,old_c,fileName (note 2)
| 'openwith1'                    | 🛑     | before Open With command           | c,p,v,d (note 6)
| 'openwith2'                    |        | after  Open With command           | c,p,v,(note 6)
| 'recentfiles1'                 | 🛑     | before Recent Files command        | c,p,v,fileName
| 'recentfiles2'                 |        | after  Recent Files command        | c,p,v,fileName
| 'save1'                        | 🛑     | before any Save command            | c,p,v,fileName
| 'save2'                        |        | after  any Save command            | c,p,v,fileName
| 'select1'                      | 🛑     | before selecting a position        | c,new_p,old_p
| 'select2'                      |        | after  selecting a position        | c,new_p,old_p
| 'select3'                      |        | after  selecting a position        | c,new_p,old_p
| 'set-mark'                     |        | when a mark is set                 | c,p,v
| 'start1'                       |        | after app.finishCreate()           | None
| 'start2'                       |        | after opening first Leo window     | c,p,v,fileName
| 'unselect1'                    | 🛑     | before unselecting a vnode         | c,new_p,old_p
| 'unselect2'                    |        | after  unselecting a vnode         | c,new_p,old_p
| '\@url1'                       | 🛑     | before double-click @url node      | c,p,url 
| '\@url2'                       |        | after  double-click @url node      | c,p

1.  'commands' hooks: The label entry in the keywords dict contains the
    'canonicalized' form of the command, that is, the lowercase name of the command
    with all non-alphabetic characters removed.

2.  'open1' and 'open2' hooks: These are called with a keywords dict containing the following entries:

    - c:          The commander of the newly opened window.
    - old_c:      The commander of the previously open window.
    - new_c:      (deprecated: use 'c' instead) The commander of the newly opened window.
    - fileName:   The name of the file being opened.

    You can use old_c.p and c.p to get the current position in the old and new windows.
    Leo calls the 'open1' and 'open2' hooks only if the file is not already open. Leo
    will also call the 'open1' and 'open2' hooks if: a) a file is opened using the
    Recent Files menu and b) the file is not already open.

3. g.app.closeLeoWindow calls the 'close-frame' hook just before
    removing the window from g.app.windowList. The hook code may remove the window
    from app.windowList to prevent g.app.closeLeoWindow from destroying the window.

4. Leo calls the 'headkey1' and 'headkey2' when the headline has *actually* changed.

5. p is the new node (position) containing '@auto filename.ext'

6. The d argument to the open-with event handlers is a dictionary whose keys
    are all the tags specified by the user in the body of the @openwith node.
