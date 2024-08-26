---
sidebar_position: 3
---

# Using Leo as a PIM

This chapter tells how you can use Leo as a *Personal Information Manager*. It introduces **clones**: one of Leo's most unusual and powerful features for organizing data.

## Clones

A **clone** is a node that appears in more than one place in a Leo outline. A small red arrow in the icon box marks each clone. All clones of a node are actually *the same node*:

- Any change to one clone affects all clones.
- Inserting, moving, or deleting any child of a clone will change all other clones on the screen.

`` Ctrl-` ``  (clone-node)\
Clones a node. The shortcut uses back-tick, *not* a single quote.  This character is often on the same keyboard key as the tilde `~` character.

> 🧪 **Please take a few moments to experiment with clones:**
> - Create a node whose headline is A.
> - Clone node A with the ``clone-node`` command.
> - Type some text into the body of A.
> - All clones of A now have the same body.
> - Insert a node, say B, as a child of any of the A nodes.
> - Notice that *all* the A nodes now have a B child.
> - See what happens if you clone B.
> - See what happens if you insert, delete or move nodes that are children of A.
> - When you delete a node's penultimate clone, the node is no longer a clone.

## Clones create views

To start a project, clone nodes related to the project and drag them at or near the top level, where you can get at them easily. When the project is complete, just delete the clones. This workflow is surprisingly effective:

- The original nodes never move, but they change whenever their clones do.

- There is nothing to "put back in place" when you are done. Just delete the clones.

Used this way, **clones create views**: when you gather cloned nodes together for a project, you are, in effect, creating a project-oriented view of the outline. This view **focuses your attention** on only those nodes that are relevant to the task at hand.

## Using URLs

Leo highlights URLs whenever syntax is coloring is enabled.

``Alt-Left-Click`` or ``Ctrl-Left-Click`` (open-url-under-cursor)\
    Opens the URL under the cursor.
    
``open-url``\
    Opens a URL appearing either in the headline or the first line of body text. If a headline starts with ``@url``, the rest of the headline is taken to be a url.

## Using Chapters

@chapter trees denote a **chapter**. You can **activate** a chapter from the icon area, or with chapter-select commands. Activating a chapter makes only those nodes in the chapter visible. The ``main`` chapter represents the entire outline. Activating the ``main`` chapter shows all outline nodes.

``chapter-select-main``
    Selects the main chapter.

``chapter-select-<chapter-name>``
    Selects a chapter by name.

## Summary

Clones are nodes appearing in multiple places in the outline.

- Changes to one clone affect all other clones.
- All clones of a node are *exactly the same node*.

Views allow multiple views of data to exist in a single outline.

- A view is simply a collection of nodes.
- View focus attention on tasks and reduce searching for nodes.

Alt-clicking or Ctrl-clicking any URL opens the URL.

@chapter trees denote chapters. Activating a chapter shows only the nodes in that chapter.
