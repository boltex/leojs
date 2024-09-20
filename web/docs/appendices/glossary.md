---
sidebar_position: 5
toc_max_heading_level: 2
---

# Glossary

This is a short glossary of important terms in Leo's world. For more information about terms, look in the index for links to discussions in other places, especially in [Getting Started](../getting-started/tutorial-basics.md) and [Directives Reference](../users-guide/directives.md).

## \@

### \@

    Starts a doc part. Doc parts continue until an @c
    directive or the end of the body text.

### \@@ convention for headlines

    Within @asis trees only, if a headline starts with @@, Leo
    writes everything in the headline following the @@ just before the
    corresponding body text.

### \@\<file> node

    A node whose headline starts with @asis, @clean, @edit, @file, @shadow, @thin, or their longer forms. We often refer to outline nodes by the directives they contain. For example, an @file node is a node whose headline starts with @file, etc.

### \@all

    Copies the body text of all nodes in an @file tree to the external file.

### \@asis \<filename>

    Creates an external file containing no Leo sentinels directly from the @asis tree.

### \@auto \<filename>

    Imports an external file into the Leo outline, splitting the file into pieces if an importer exists for the give filetype. Importers presently exist for the following languages: C, C++, C#, HTML, INI files, Java, PHP, Pascal, Python and XML.

### \@c and @code

    Ends a doc part and starts a code part.

### \@chapter

    An @chapter tree represents a chapter.

### \@clean

    Creates an external file without sentinels. Section references and the @all and @others directives are valid in @clean trees.

### \@color

    Enables syntax coloring in a node and its descendants until the next

### \@comment

    Sets the comment delimiters in @thin, @file and @shadow files.

### \@delims

  Sets the comment delimiters in @thin, @file and @shadow files.

### \@edit \<filename>

    Reads an entire external file into a single node.

### \@encoding \<encoding>

    Specifies the Unicode encoding for an external file.

### \@file \<filename>

    Creates an external file containing sentinels. When writing @file trees, Leo expands section references and @all and @others directives. **Important**: @file is the recommended way to create and edit most files. Using @file trees is **highly recommended** when sharing external files in a collaborative environment.

### \@first \<text>

    The @first directive allows you to place one or more lines at the *very start* of an external file, before the first sentinel. The @first directive must appear at the *very start* of body text. For example:

    ```
    @firѕt #! /usr/bin/env python
    ```

### \@killcolor

    Completely disables syntax coloring in a node, regardless of other directives.

### \@language \<language name>

    Specifies the source language, which affects syntax coloring and the comments delimiters used in external files and syntax coloring.

### \@last \<text>

    Allows you to place lines at the very end of external files, after the last sentinel. This directive must appear at the *very end* of body text. For example:
    
    ```
    @firѕt <?php
    ...
    @laѕt ?>
    ```

### \@lineending cr/lf/nl/crlf

    Sets the line endings for external files.

### \@nocolor

    Disables syntax coloring in a node and its descendants until the next @color
    directive.

### \@nocolor-node

    Completely disables coloring for one node. Descendant nodes are not affected.

### \@nosent

    Creates external files without sentinels. Unlike @clean, @nosent trees
    are never updated from from external files.

### \@nowrap

    Disables line wrapping the Leo's body pane.

### \@others

    Copies the body text of all nodes *except* section definition nodes in an
    @file tree to the corresponding external file.

### \@pagewidth \<n>

   Sets the page width used by the reformat-paragraph command.
   This directive also controls how @doc parts are broken into lines.


  Sets the path prefix for relative filenames for descendant \@\<file> directives.

### \@tabwidth \<n>

    Sets the width of tabs. Negative tab widths cause Leo to convert tabs to
    spaces.

### \@thin \<filename>

    A synonym for @file.

### \@wrap

    Enables line wrapping in Leo's body pane.

## A - C

### Auto Reload

    To Automatically refresh and synchronize content when external files are modified. This can be set with the **Force reload or ignore changes** setting in the LeoJS welcome/settings screen.

### Body pane

    The pane containing the body text of the currently selected headline in the
    outline pane.

### Body text

    The text in the body pane. That is, the contents of a node.

### Body text box

    A small blue box in the icon box indicating that the node contains body
    text.

### Child

    The direct descendant of a node.

### Clone

    A copy of a tree that changes whenever the original changes.
    The original and all clones are treated equally:
    no special status is given to the "original" node.

### Clone arrow

    A small red arrow in the icon box indicating that the node is a clone.

### Code part

    A part of a section definition that contains code. Code parts start with @c
    or @code directives and continue until the next doc part.

### Contract

    To hide all descendants of a node.

## D - G

### Demote

    To move all siblings that follow a node so that they become children of the node.

### Descendant
    An offspring of a node.  That is, a child, grandchild, etc. of a node.

### Detached Body pane

    In LeoJS, a **Detached Body Pane** is an editor panel like the body pane, but independent of the selected node. This can be useful when needing to compare some nodes contents to another.
    
    They can be opened with the 'Open Aside' command. That command is also available when right-clicking on a node in the outline via its context menu.

### Directive

    A keyword, preceded by an '@' sign, in body text that controls Leo's
    operation. The keyword is empty for the @ directive.

### Dirty Node

    A node whose headline or body text has changed.

### Doc part

    A part of a section definition that contains comments. Doc parts start with
    @ and continue until the @c directive or the end of the body text.

### Escape convention

    A convention for representing sequences of characters that would otherwise
    have special meaning. **Important**: Leo does not support escape conventions
    used by [noweb](https://www.cs.tufts.edu/~nr/noweb/). Any line containing matched \<\< and \>\> is a section
    reference, regardless of context. To use \<\< and \>\> as ordinary characters,
    place them on separate lines.

### Expand

    To make the children of a node visible.

### External file

    A file outside of Leo that is connected to Leo by an @\<file> node.

### Go Anywhere

    In LeoJS, the `CTRL+P` keybinding is used to call the **'Go Anywhere'** command to navigate the outline directly to a given node instead of the 'Repeat Complex Command' of the original Leo.

### Gnx (Global Node Index)

    A unique, immutable string permanently associated with each vnode.
    See [format of external files](format-of-external-files.md).

### Grandchild

    The child of a child of a node.

## H - L

### Headline

    The headline text of a node.  The part of the node visible in the outline pane.

### Hoist & dehoist

    Hoisting a node redraws the screen that node and its descendants becomes the
    only visible part of the outline. Leo prevents the you from moving nodes
    outside the hoisted outline. Dehoisting a node restores the outline.
    Multiple hoists may be in effect: each dehoist undoes the effect of the
    immediately preceding hoist.

### Icon box

    An icon just to the left of headline text of a node indicating whether the
    node is cloned, marked or dirty, and indicating whether the node contains
    body text.

### Leonine

Leonine refers to Leo’s unique way of organizing data and programs.

### Log Pane

    The part of Leo's main window that shows informational messages from Leo.

## M - O

### Mark

    A red vertical line in the icon box of a node.

### Node

    The organizational unit of an outline. The combination of headline text and
    body text. Sometimes used as a synonym for tree.

### Offspring

    A synonym for the descendants of a node.
    The children, grandchildren, etc. of a node.

### Organizer node

    A node containing no body text. Organizing nodes may appear anywhere in an
    @file tree; they do not affect the external file in any way. In particular,
    organizing nodes do not affect indentation in external files.

### Orphan node

    A node that would not be copied to a external file. Orphan nodes can arise
    because an @file tree has no @others or @all directives. Sections that are
    defined but not used also create orphan nodes.

    Leo issues a warning when attempting to write an @file tree containing
    orphan nodes, and does not save the external file. No information is lost;
    Leo saves the information in the @file tree in the .leo file. Leo will load
    the @file tree from the .leo file the next time Leo opens the .leo file.

### Outline

    A node and its descendants. A tree. All the nodes of a .leo file.

### Outline order

    The order that nodes appear on the screen when all nodes are expanded.

### Outline pane

    The pane containing a visual representation of the entire outline, or a part
    of the outline if the outline is hoisted.

## P - R

### Parent

    The node that directly contains a node.

### Plugin

    A way to modify and extend Leo without changing Leo's core code.
    See [Writing plugins](../advanced-topics/writing-plugins.md).

### Promote

    To move all children of a node in an outline so that they become siblings of
    the node.

### Reference .leo file

    `leoeditor/leo/core` contains a **reference .leo file**: **LeoPyRef.leo**.
    This file should change only when adding new external files to Leo.
    Developers should use a local copy of LeoPyRef.leo (conventionally called
    **leoPy.leo**) for their own work.

### reStructuredText (rST)

    A simple, yet powerful markup language for creating .html, or LaTeX output
    files. See the [rST primer](https://docutils.sourceforge.io/docs/user/rst/quickstart.html).

### Root

    The first node of a .leo file, outline, suboutline or @\<file> tree.

## S - Z

### Section

    A fragment of text that can be incorporated into external files.

### Section definition

    The body text of a section definition node.

### Section definition node

    A node whose headline starts with a section name and whose body text defines
    a section.

### Section name

    A name enclosed in \<\< and \>\>. Section names may contain any characters
    except newlines and ">>".

### Section reference

    A section name appearing in a code part. When writing to an external file,
    Leo replaces all references by their definitions.

### Sentinel

    Comment lines in external files used to represent Leo's outline structure.
    Such lines start with an @ following the opening comment delimiter.
    Sentinels embed outline structure into external files.

    **Do not alter sentinel lines**. Doing so can corrupt the outline structure.

### Settings

    Plugins and other parts of Leo can get options from @settings trees,
    outlines whose headline is @settings. When opening a .leo file, Leo looks
    for @settings trees in the outline being opened and also in various
    leoSettings.leo files. @settings trees allow plugins to get options without
    any further support from Leo's core code. For a full discussion of @settings
    trees, see [Customizing Leo](../users-guide/customizing.md).

### Sibling

    Nodes with the same parent. Siblings of the root node have the hidden root
    node as their parent.

### Target language

    The language used to syntax color text. This determines the default comment
    delimiters used when writing external files.

### Tree

    An outline. A node and its descendants.

### Underindent line

    A line of body text that is indented less then the starting line of the
    class, method or function in which it appears. Leo outlines can not
    represent such lines exactly: every line in an external file will have at
    least the indentation of any unindented line of the corresponding node in
    the outline.

### uA

    uA's (User Attributes) are persistent Python dicts that allows scripts
    and plugins to associate additional data with each node. See
    [extensible attributes](../users-guide/customizing.md#uas-extensible-attribues-of-nodes).

### User-defined types

    Headlines naturally describe a node’s contents: headlines naturally define types. Leo’s core supports types such as @button, @rst, @url, etc. Scripts and plugins can easily define other types.

### View node

    A node that represents a view of an outline. View nodes are typically
    ordinary, non-cloned nodes that contain cloned descendant nodes. The cloned
    descendant nodes comprise most of the data of the view. Other non-cloned
    nodes may add additional information to the view.
