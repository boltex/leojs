---
sidebar_position: 4
---

# Directives Reference

## \@\<file> and \@path directives

This section discusses the @\<file\> directives. They are used as node headlines: These directives create or import external files.

`@<file>` nodes directive that appear in headlines create external files:

| Directive            |                                                |
|:---------------------|:-----------------------------------------------|
|**@asis** \<filename\>    |   write only, no sentinels, exact line endings |
|**@auto** \<filename\>    |   recommended                                  |
|**@clean** \<filename\>   |   recommended                                  |
|**@edit** \<filename\>    |   @edit node contains entire file              |
|**@file** \<filename\>    |   recommended                                  |
|**@nosent** \<filename\>  |   write only, no sentinels                     |

> 📌 **NOTE**\
> `@file`, `@clean` and `@auto` are the recommended ways of creating external files. `@asis` and `@nosent` are for special occasions.

The following table compares the various ways of creating external files. Later sections provide more details:

| @\<file\> Kind | Sentinels | @others | .leo Data | Write Only |
| :------------- | :-------: | :-----: | :-------: | :--------: |
| @asis          |    ❌     |   ❌    |    ✔️     |     ✔️     |
| @auto          |    ❌     |   ✔️    |    ❌     |     ❌     |
| @clean         |    ❌     |   ✔️    |    ✔️     |     ❌     |
| @edit          |    ❌     |   ❌    |    ❌     |     ❌     |
| @file          |    ✔️     |   ✔️    |    ❌     |     ❌     |
| @nosent        |    ❌     |   ✔️    |    ✔️     |     ✔️     |

> 📌 **NOTE**\
> @auto nodes read files using language-specific importers.

By default, the file's extension determines the importer:

| Extensions                 | Importer          |
|:---------------------------|:------------------|
|.c, .cc, .c++, .cpp,.cxx    | C                 |
|.cs', .c#'                  | C Sharp           |
|.el                         | Elisp             |
|.h, .h++                    | C                 |
|.html, .htm                 | HTML              |
|.ini                        | Config file       |
|.ipynb                      | Jupyter notebook  |
|.java                       | Java              |
|.js                         | JavaScript        |
|.md                         | Markdown          |
|.org                        | Org Mode          |
|.otl                        | Vim outline       |
|.pas                        | Pascal            |
|.php                        | PHP               |
|.py, .pyi, .pyw             | Python            |
|.rest, .rst                 | reStructuredText  |
|.ts                         | TypeScript        |
|.xml                        | XML               |

You can also specify importers *explicitly* as follows:

|   @auto-xxx         | Importer          |
|:--------------------|:------------------|
|   @auto-ctext       |  ctext            |
|   @auto-markdown    |  markdown         |
|   @auto-md          |  markdown         |
|   @auto-org         |  org-mode         |
|   @auto-org-mode    |  org-mode         |
|   @auto-otl         |  vimoutline       |
|   @auto-vim-outline |  vimoutline       |
|   @auto-rst         |  reStructuredText |

> 🚨 **IMPORTANT**\
> The importers/exporters for markdown, org-mode, reStructuredText and vimoutline files automatically generate section heading of the appropriate level. Body text of the top-level @auto node is ignored.

### \@asis \<path>

The `@asis` directive creates an external file without sentinels and without any expansions.

Use this directive only when you must have complete control over every character of the external file. When writing `@asis` nodes, writes the body text of all nodes in outline order. Leo writes the body text *as is*, without recognizing section definitions, without expanding section references, and without treating directives specially in any way. In particular, Leo copies all directives, including `@` or `@c` directives, to the external file as text. **Warning**: Because the external file contains no sentinels, `@asis` trees can not be updated from changes made outside of Leo. If you want this capability, use `@clean` instead.

**The @@ convention**: Within `@asis` trees only, if a headline starts with @@, Leo writes everything in the headline following the @@ just before the corresponding body text.

Files created from `@asis` trees contain *nothing* not contained in body text (or @@ headlines). In particular, if body text does not end in a newline, the first line from the next node will concatenated to the last line of the preceding node.

Within `@asis` trees, Leo writes no sentinels to the external file, so Leo can not update the outline using changes to the external file. When reading .leo files, Leo does *not* read external files created from `@asis` nodes. Instead, all data in an `@asis` tree is stored in the .leo file.

Within `@asis` trees, Leo recognizes the `@ignore` directive only in the *ancestors* of `@asis` nodes. This allows you to use the `@ignore` directive to prevent Leo from writing `@asis` trees.

**Note**: `@file-asis` and `@silent` are deprecated synonyms for `@asis`.

### \@auto \<path>

The `@auto` directive imports an external file into a tree of nodes.

`@auto` trees allow people to use Leo in collaborative environments without using sentinels in external files. Even without sentinels, `@auto` trees can change when the corresponding external file changes outside of Leo.

`@auto` nodes read files using language-specific importers. By default, the file's extension determines the importer:

| Extensions                  | Importer           |
|:----------------------------|:-------------------|
| .c, .cc, .c++, .cpp,.cxx    | C                  |
| .cs', .c#'                  | C Sharp            |
| .el                         | Elisp              |
| .h, .h++                    | C                  |
| .html, .htm                 | HTML               |
| .ini                        | Config file        |
| .ipynb                      | Jupyter notebook   |
| .java                       | Java               |
| .js                         | JavaScript         |
| .md                         | Markdown           |
| .org                        | Org Mode           |
| .otl                        | Vim outline        |
| .pas                        | Pascal             |
| .php                        | PHP                |
| .py, .pyi, .pyw             | Python             |
| .rest, .rst                 | reStructuredText   |
| .ts                         | TypeScript         |
| .xml                        | XML                |

You can also specify importers *explicitly* as follows:

| @auto-xxx          | Importer         |
|:-------------------|:-----------------|
| @auto-ctext        | ctext            |
| @auto-markdown     | markdown         |
| @auto-md           | markdown         |
| @auto-org          | org-mode         |
| @auto-org-mode     | org-mode         |
| @auto-otl          | vimoutline       |
| @auto-vim-outline  | vimoutline       |
| @auto-rst          | reStructuredText |

> 📌 **NOTE**\
> The importers/exporters for [markdown](https://en.wikipedia.org/wiki/Markdown), [org-mode](https://en.wikipedia.org/wiki/Org-mode), [reStructuredText](https://docutils.sourceforge.io/rst.html) and [vimoutline](https://www.vim.org/scripts/script.php?script_id=3515) files automatically generate section heading of the appropriate level. Body text of the top-level `@auto` node is ignored.

#### \@auto sanity checks

When importing files into `@auto` trees, Leo performs several checks to ensure that writing the imported file will produce exactly the same file. These checks can produces **errors** or **warnings**. Errors indicate a potentially serious problem. Leo inserts an `@ignore` directive in the `@auto` tree if any error is found. This prevents the `@auto` tree from modifying the external file.

Before importing a file, Leo **regularizes** the leading whitespace of all lines of the original source file. That is, Leo converts blanks to tabs or tabs to blanks depending on the value of the `@tabwidth` directive in effect for the `@auto` node. Leo also checks that the indentation of any non-blank line is a multiple of the indentation specified by the `@tabwidth` directive. **Strict languages** are languages such as Python for which leading whitespace must be preserved exactly as it appears in the original source file. Problems during regularizing whitespace generate errors for strict languages and warnings for non-strict languages.

After importing a file, Leo verifies that writing the `@auto` node would create the same file as the original file. Such file comparison mismatches generate errors unless the problem involves only leading whitespace for non-strict languages. Whenever a mismatch occurs the first non-matching line is printed.

File comparison mismatches can arise for several reasons:

    1. Bugs in the import parsers. Please report any such bugs immediately.

    2. Underindented lines in classes, methods or function.

An **underindented line** is a line of body text that is indented less then the starting line of the class, method or function in which it appears. Leo outlines can not represent such lines exactly: every line in an external file will have at least the indentation of any unindented line of the corresponding node in the outline. Leo will issue a warning (not an error) for underindented Python comment lines. Such lines can not change the meaning of Python programs.

### \@clean \<path>

The `@clean <filename>` creates an external file without sentinel lines. `@clean` trees will probably be the most convenient way of creating and accessing external files for most people.

When writing an `@clean` tree, Leo expands section references, `@all` and

When reading an `@clean` tree, Leo propagates changes from the external file to the `@clean` tree using the [Mulder/Ream update algorithm](../appendices/mulder-ream.md).

> 📌 **NOTE**\
> The `@bool force_newlines_in_at_nosent_bodies` setting controls whether Leo writes a trailing newline if non-empty body text does not end in a newline. The default is True.

> 💡 **TIP**\
> The [check-nodes](commands.md#syncing-clean-files) command helps sync `@clean` trees when collaborating with others.

### \@edit \<path>

The `@edit` directive imports an external file into a single node.

When reading `@edit` nodes, Leo reads the entire file into the 
`@edit` node. Lines that look like sentinels will be read just as they are.

When writing `@edit` nodes, `@edit` nodes must not have children
and section references and `@others` are not allowed.

### \@file \<path> (aka @thin)

The `@file` directive creates an external file containing sentinels. When writing
@file trees, Leo expands section references and `@all` and `@others` directives.

When reading external files created by `@file`, the sentinels allow Leo to
recreate all aspects of the outline. In particular, Leo can update the
outline based on changes made to the file by another editor. 

**Important**: `@file` is the recommended way to create and edit most
files. In particular, using `@file` nodes is **highly recommended**
when sharing external files in a collaborative environment. The `@all`
directivive is designed for "catch-all" files, like todo.txt or
notes.txt or whatever. Such files are assumed to contain a random
collection of nodes, so there is no language in effect and no real
comment delimiters.

The `@thin` directive is a synonym for `@file`.

### \@nosent \<path>

The `@nosent` directive creates an external file **without** sentinels. When writing
`@nosent` trees, Leo expands section references and `@all` and `@others` directives.

> 🚨 **WARNING**\
Because the external file contains no sentinels, `@nosent` trees can not be updated from changes made outside of Leo. If you want this capability, use `@clean` instead.

### \@shadow \<path> (deprecated)

> ❌ **DEPRECATED**\
> `@shadow` is **deprecated**. Use `@clean` instead. `@clean` is faster than `@shadow` and requires no hidden files.

The `@shadow` directive creates *two* external files, a **public** file without sentinels, and a **private** file containing sentinels.

When reading an `@shadow` node, Leo uses the  [Mulder/Ream update algorithm](../appendices/mulder-ream.md) to compare the public and private files, then updates the outline based on changes to the *public* file.

Leo can do an initial import of `@shadow` trees by parsing the corresponding public file, exactly as is done for `@auto` nodes.

### \@path \<path>

Sets the **path prefix** for relative filenames for all `@<file>` trees *except* `@file` trees.

The `@path` directive may appear in any headline or the body text `@<file>` nodes (`@clean`, `@auto`, etc.).

> 📌 **NOTE**\
> The `@path` directive is *not* allowed in the body text of `@file` nodes.

The path is an **absolute path** if it begins with `c:\\` or `/`, otherwise the path is a **relative** paths.

Multiple `@path` directives may contribute to the path prefix. Absolute paths overrides any ancestor `@path` directives. Relative paths add to the path prefix.

If no `@path` directives are in effect, the default path prefix is the directory containing the .leo file.

## \@all and \@others

These control how Leo places text when writing external files. They are two of the most important directives in Leo.

`@all`
 
<ul>
    Copies *all* descendant nodes to the external file. Use `@all` to place
    unrelated data in an external file.

    The `@all` directive is valid only in the body of `@file` trees.

    Within the range of an `@all` directive, Leo ignores the `@others` directive
    and section references, so Leo will not complain about orphan nodes.

    The `@all` directivive is designed for "catch-all" files, like
    todo.txt or notes.txt or whatever. Such files are assumed to
    contain a random collection of nodes, so there is no language in
    effect and no real comment delimiters.
</ul>

`@others`
 
<ul>
    Writes the body text of all unnamed descendant into the external file, in
    outline order.

    Whitespace appearing before `@others` directive adds to the indentation of
    all nodes added by the `@others` directive.

    A single node may contain only one `@others` directive, but descendant nodes
    may have other `@others` directives.
</ul>

## \@leo directives

`@leo` directives have the form `@leo <path>` where `path` is a path (absolute
or relative) to another Leo outline. To move between outlines, just select
an `@leo` node and execute the `open-at-leo-file` command!

`@leo` directives help split a single (too large) outline in a small **top-level outline** and various **sub-outlines**.

For example, using a single outline to manage [Rust's compiler repo](https://github.com/rust-lang/rust/tree/master/compiler) causes performance problems.
Managing each the 70+ sub-directories with a smaller sub-outline solves these problems.

A new script helper, **c.makeLinkLeoFiles**, creates the sub-outlines automatically.
For example, here is the script I use to create dozens of sub-outlines in my local clone of Rust's compiler.

```ts
  c.makeLinkLeoFiles(
    ['.rs'],
    `C:\\Repos\\ekr-fork-rust\\compiler`,
  );
```

This script creates the `compiler_links.leo` outline in the `compiler`
directory. In addition, for each direct sub-directory (say x) of the
top-level directory, the script creates an outline called `x_links.leo`.

The script is essential for large repos. The top-level `compiler` directory
contains more than 70 sub-directories!

The top-level outline (`compiler_links.leo`) contains `@leo` directives for all the sub-outline::

<ul>
  @leo rustc/rustc.leo
  @leo rustc_abi/rustc_abi.leo
  @leo rustc_arena/rustc_arena.leo
  And dozens of others.
</ul>

Note that all paths above are relative to `compiler_links.leo`.
  
Each sub-outline contains:

- One `@leo` node (the back link) pointing to the top-level outline.
- One `@clean` node for each `.rs` file in the subdirectory and *all descendant directories*.

## Syntax coloring directives

The `@color`, `@killcolor`, `@nocolor` and `@nocolor-node` directives control how
Leo colors text in the body pane.

These directives typically affect the node in which they appear and all descendant nodes. Exception: an **ambiguous node**, a node containing both `@color` and `@nocolor` directives, has no effect on how Leo colors text in descendant nodes.

`@color`
 
<ul>
    Enables syntax coloring until the next `@nocolor` directive.
</ul>

`@killcolor`
 
<ul>
    Disables syntax coloring in a node, overriding all `@color`, `@nocolor` or
    `@nocolor-node` directives in the same node.
</ul>

`@nocolor`
 
<ul>
    Disables syntax coloring until the next `@nocolor` directive.
</ul>

`@nocolor-node`
 
<ul>
    Disables coloring for only the node containing it. The `@nocolor-node`
    directive overrides the `@color` and `@nocolor` directives within the same
    node.
</ul>

## Dangerous directives

These directives alter how Leo represents data in external files. They are **dangerous**--mistakes in using these sentinels can make it impossible for Leo to read the resulting external file. Use them with care!

Nevertheless, these sentinels can be useful in special situations.

`@comment <1, 2 or three comment delims>`
 
<ul>
    Sets the comment delimiters in `@file` and `@shadow` files.
    **Important**: Use `@comment` for unusual situations only. In most cases, you
    should use the `@language` directive to set comment delimiters.

    The `@comment` directive may be followed by one, two or three delimiters,
    separated by whitespace. If one delimiter is given, it sets the delimiter
    used by single-line comments. If two delimiters are given, they set the
    block comment delimiter. If three delimiters are given, the first sets the
    single-line-comment delimiter, and the others set the block-comment
    delimiters.

    Within these delimiters, underscores represent a significant space, and
    double underscores represent a newline. Examples:

```
@ϲomment REM_
@ϲomment __=pod__ __=cut__
```

    The second line sets PerlPod comment delimiters.

    **Warning**: the `@comment` and `@delims` directives **must not** appear in
    the same node. Doing so may create a file that Leo can not read.

    **Note**: `@language` and `@comment` may appear in the same node, provided
    that `@comment` appears *after* the `@language` directive: `@comment` overrides
    `@language`.

    The `@comment` directive must precede the first section name or `@c`
    directive.

    There are situations where using `@delims` or `@comment` is not avoidable or impractical to
    add new language definition, and including it causes the resulting file to be invalid.
    In place of delimiter definition, use `@0x` + delimiter encoded in hexadecimal.
    The hexadecimal part must be acceptable input to binascii.unhexlify(), otherwise whole 
    directive will be ignored. Use binascii.hexlify('my-delimiter') to generate it.
    Decoded delimiters are not checked for validity (such as, UTF-8) and whether they 
    do not clash with Leo format (like newline or NUL characters)!

    Example:

```
@ϲomment @0x3c212d2d2120 @0x202d2d3e
```

    for GenshiXML is the same definition as 

```
@ϲomment <!--!_ _-->
```

    to create comments that will be removed from the output by Genshi. But the latter would 
    cause XML parsing error on the `@comment` line.
</ul>

`@delims <1 or 2 comment delims>`
 
<ul>
    Sets comment delimiters in external files containing sentinel lines.

    The `@delims` directive requires one or two delimiters, separated by
    whitespace. If one delimiter is present it sets the single-line-comment
    delimiter. If two delimiters are present they set block comment delimiters.

    This directive is often used to place Javascript text inside XML or HTML
    files. Like this:

```
@ԁelims /* */
Javascript stuff
@ԁelims <-- -->
HTML stuff
```

    **Warning**: you **must** change back to previous delimiters using another
    `@delims` directive. Failure to change back to the previous delimiters will
    thoroughly corrupt the external file as far as compilers, HTML renderers,
    etc. are concerned. Leo does not do this automatically at the end of a node.

    **Warning**: the `@comment` and `@delims` directives **must not** appear in
    the same node. Doing so may create a file that Leo can not read.

    **Note**: The `@delims` directive can not be used to change the comment
    strings at the start of the external file, that is, the comment strings for
    the `@+leo sentinel` and the initial `@+body` and `@+node` sentinels.
</ul>

## All other directives

This section is a reference guide for all other Leo directives, organized alphabetically.

Unless otherwise noted, all directives listed are valid only in body text, and they must start at the leftmost column of the node.

`@ and @doc`

<ul>
These directives start a doc part. `@doc` is a synonym for `@`. Doc parts
continue until an `@c` directive or the end of the body text. For example:

```
 @ This is a comment in a doc part.
 Doc parts can span multiple lines.
 The next line ends the doc part
 @ϲ
```
When writing external files, Leo writes doc parts as comments.

Leo does not recognize `@` or `@doc` in `@asis` trees or when the `@all`
 or `@delims` directives are in effect.
</ul>

`@c and @code`

<ul>
    Ends any doc part and starts a code part.

    `@code` is a deprecated synonym for `@c`.

    Leo does not recognize this directive in `@asis` trees.
</ul>

 `@chapter`

<ul>
    An `@chapter` tree represents a chapter. For full details, see [Using Chapters](commands.md#using-chapters).

    These directives must appear in the node's headline.
</ul>

`@encoding <encoding>`
 
<ul>
    Specifies the Unicode encoding for an external file. For example:

        `@encoding iso-8859-1`

    When reading external files, the encoding given must match the encoding
    actually used in the external file or "byte hash" will result.
</ul>

`@first <text>`
 
<ul>
    Places lines at the very start of an external file, before any Leo
    sentinels. `@first` lines must be the *very first* lines in an `@<file>` node.
    More then one `@first` lines may appear.

    This creates two first lines, a shebang line and a Python encoding line:

```
@firѕt #! /usr/bin/env python
@firѕt # -*- coding: utf-8 -*-
```

    Here is a perl example:

```
@firѕt #!/bin/sh -- # perl, to stop looping
@firѕt eval 'exec /usr/bin/perl -w -S $0 ${1+"$@"}'
@firѕt     if 0;
```
</ul>

`@ignore`
 
<ul>
    Tells Leo to ignore the subtree in which it appears.

    In the body text of most top-level @\<file> nodes, the `@ignore` directive
    causes Leo not to write the tree. However, Leo ignores `@ignore` directives
    in `@asis` trees.

    Plugins and other parts of Leo sometimes `@ignore` for their own purposes. For
    example, Leo's unit testing commands will ignore trees containing `@ignore`.
    In such cases, the `@ignore` directive may appear in the headline or body
    text.
</ul>

`@language <language name>`
 
<ul>
    Specifies the language in effect, including comment delimiters.
    If no `@language` directive is in effect, Leo uses the defaults specified
    by the `@string target-language` setting.

    A node may contain multiple `@language` directives.

    The valid language names include the following: actionscript, ada95, ahk, antlr, apacheconf, apdl, applescript, asciidoc, asp, aspect_j, assembly_macro32, assembly_mcs51, assembly_parrot, assembly_r2000, assembly_x86, awk, b, batch, bbj, bcel, bibtex, c, chill, clojure, cobol, coldfusion, cplusplus, csharp, css, cython, d, dart, doxygen, eiffel, embperl, erlang, factor, forth, fortran, fortran90, foxpro, gettext, groovy, haskell, haxe, html, i4gl, icon, idl, inform, ini, inno_setup, interlist, io, java, javascript, jhtml, jmk, jsp, kivy, latex, lilypond, lisp, lotos, lua, mail, makefile, maple, matlab, md, ml, modula3, moin, mqsc, netrexx, nqc, nsi, nsis2, objective_c, objectrexx, occam, omnimark, pascal, patch, perl, php, phpsection, pike, pl1, plain, plsql, pop11, postscript, povray, powerdynamo, prolog, pseudoplain, psp, ptl, pvwave, pyrex, python, r, rebol, redcode, rest, rhtml, rib, rpmspec, rtf, ruby, rview, sas, scala, scheme, sdl_pr, sgml, shell, shellscript, shtml, smalltalk, smi_mib, splus, sqr, squidconf, ssharp, swig, tcl, tex, texinfo, text, tpl, tsql, uscript, vbscript, velocity, verilog, vhdl, xml, xsl, yaml, zpt.

    **Note**: Shell files have comments that start with #.

    Case is ignored in the language names. For example, the following are
    equivalent:

```
@lаnguage html
@lаnguage HTML
```

    The `@language` directive also controls syntax coloring. For language x, the
    file leo/modes/x.py describes how to colorize the language. To see the
    languages presently supported, look in the leo/modes directory. There are
    over 100 such languages.
</ul>

`@last <text>`
 
<ul>
    Places lines at the very end of external files.

    This directive must occur at the *very end* of top-level @\<file> nodes. More
    than one `@last` directive may exist. For example:

```php
@firѕt <?php
...
@laѕt ?>
```

    Leo does not recognize `@last` directive in `@asis` trees.
</ul>

`@lineending cr/lf/nl/crlf`
 
<ul>
    Sets the line endings for external files.
    This directive overrides the `@string output_newline` setting.

    The valid forms of the `@lineending` directive are:

| Line Ending         | Platform                                               |
|:--------------------|:-------------------------------------------------------|
|@lineending nl       |    The default, Linux.                                 |
|@lineending cr       |    Mac                                                 |
|@lineending crlf     |    Windows                                             |
|@lineending lf       |    Same as 'nl', not recommended                       |
|@lineending platform |    Same as platform value for output_newline setting.  |
</ul>

`@nowrap`
 
<ul>
    Disables line wrapping the Leo's body pane.

    Only the first `@wrap` or `@nowrap` directive in a node has any effect.

    `@nowrap` may appear in either headlines or body text.
</ul>

`@pagewidth <n>`
 
<ul>
   Sets the page width used by the `reformat-paragraph` command.
   This directive also controls how `@doc` parts are broken into lines.
   \<n> should be a positive integer.  For example:

```
@pаgewidth 100`
```

  The `@pagewidth` directive overrides the `@int page_width` setting.
</ul>

`@persistence`
 
<ul>
    With `@clean` and `@file`, Leo can store **persistent data** in nodes. This information consists of the node's **gnx** (Global Node Index) and the node's **uA**, (User Attributes). The gnx gives each node a unique, immutable identity. Gnx's make clones possible. The uA allows scripts and plugins to associate arbitrarily much additional data with each node.

    By default, Leo's importers preserve neither gnx's nor uA's. This makes imported `@auto` trees second class citizens. To remedy this, if an outline contains an `@persistence` node, Leo will save data in the `@persistence` tree that allows Leo to recover gnx's and uA's when re-reading `@auto` files later. This allows clone links and uA's to persist.

    @persistence is an optional feature. The stored data is akin to bookmarks. The data can "break" (become inaccessible) if the structure (including class/method/function names) changes. However, the data will typically break infrequently. To disable this feature, just delete an existing `@persistence` node or change `@persistence` to `@@persistence`.
</ul>

`@tabwidth <n>`
 
<ul>
  Sets the width of tabs.
  Negative tab widths cause Leo to convert tabs to spaces.
</ul>

`@wrap`
 
<ul>
    Enables line wrapping in Leo's body pane.

    Only the first `@wrap` or `@nowrap` directive in a node has any effect.

    `@wrap` may appear in either headlines or body text.
</ul>
