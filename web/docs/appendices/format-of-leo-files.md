---
sidebar_position: 1
---

# Format of Leo Files

Here are the XML elements that may appear in Leo files:

\<?xml>
    Leo files start with the following line:

        \<?xml version="1.0" encoding="UTF-8"?>

\<?xml-stylesheet>
    An xml-stylesheet line is option.  For example:

        \<?xml-stylesheet ekr_stylesheet?>

\<leo_file>
    The \<leo_file> element opens an element that contains the entire file.
    \</leo_file> ends the file.

\<leo_header> 
    The \<leo_header> element specifies version information and other information
    that affects how Leo parses the file.  For example:

        \<leo_header file_format="2" tnodes="0" max_tnode_index="5725" clone_windows="0"/>

    The file_format attribute gives the 'major' format number.
    It is '2' for all 4.x versions of Leo.
    The tnodes and clone_windows attributes are no longer used.
    The max_tnode_index	attribute is the largest tnode index.

\<globals>
    The globals element specifies information relating to the entire file.
    For example:

```
        <globals body_outline_ratio="0.50">
            <global_window_position top="27" left="27" height="472" width="571"/>
            <global_log_window_position top="183" left="446" height="397" width="534"/>
        </globals>
```

    -   The body_outline_ratio attribute specifies the ratio of the height of the body pane to
        the total height of the Leo window.
        It initializes the position of the splitter separating the outline pane from the body pane.

    -   The global_window_position and global_log_window_position elements
        specify the position of the Leo window and Log window in global coordinates:

\<preferences>
    This element is vestigial.
    Leo ignores the \<preferences> element when reading.
    Leo writes an empty \<preferences> element.

\<find_panel_settings>
    This element is vestigial.
    Leo ignores the \<find_panel_settings> element when reading.
    Leo writes an empty \<find_panel_settings> element.

\<clone_windows>
    This element is vestigial.
    Leo ignores the \<clone_windows> element when reading.
    Leo no longer writes \<clone_windows> elements.

\<vnodes>
    A single \<vnodes> element contains nested \<v> elements.
    \<v> elements correspond to vnodes.
    The nesting of \<v> elements indicates outline structure in the obvious way.

\<v>
    The \<v> element represents a single vnode and has the following form:

        \<v...>\<vh>sss\</vh> (zero or more nested v elements) \</v>

    The \<vh> element specifies the headline text.
    sss is the headline text encoded with the usual XML escapes.
    As shown above, a \<v> element may contain nested \<v> elements.
    This nesting indicates outline structure in the obvious way.
    Zero or more of the following attributes may appear in \<v> elements:

        t=name.timestamp.n
        a="xxx"

    The t="Tnnn" attribute specifies the \<t> element associated with a \<v> element.
    The a="xxx" attribute specifies vnode attributes.
    The xxx denotes one or more upper-case letters whose meanings are as follows:

        C	The vnode is a clone. (Not used in 4.x)
        E	The vnode is expanded so its children are visible.
        M	The vnode is marked.
        T	The vnode is the top visible node.
        V	The vnode is the current vnode.

    For example, a="EM"  specifies that the vnode is expanded and is marked.

    **New in 4.0**:

    -   \<v> elements corresponding to @file nodes now contain tnodeList attributes.
        The tnodeList attribute allows Leo to recreate the order in which nodes should 
        appear in the outline.
        The tnodeList attribute is a list of gnx's: global node indices.
        See Format of external files (4.x) for the format of gnx's.

    -   Plugins and scripts may add attributes to \<v> and \<t> elements.
        See `Writing plugins`_ for details.

\<tnodes>
    A single \<tnodes> element contains a non-nested list of \<t> elements.

\<t>
    The \<t> element represents the body text of the corresponding \<v> element.
    It has this form:

        \<t tx="\<gnx>">sss\</t>

    The tx attribute is required.
    The t attribute of \<v> elements refer to this tx attribute.
    sss is the body text encoded with the usual XML escapes.

    **New in 4.0**: Plugins and scripts may add attributes to \<v> and \<t>
    elements. See `Writing plugins`_ for details.
