---
sidebar_position: 2
---

# Customizing Leo

This chapter discusses how to customize Leo using the plugins and other means. See [Using settings](#using-settings) for a description of how to change Leo's settings.

## Using settings

Leo stores options in **@settings trees**, outlines whose headline is `@settings`. When opening a .leo file, Leo looks for `@settings` trees not only in the outline being opened but also in various `leoSettings.leo` files. This scheme allows for the following kinds of settings:

- Per-installation or per-machine settings.
- Per-user settings.
- Per-folder settings.
- Per-file settings.

There are four kinds of settings files:

1. **Default settings files**, named **leoSettings.leo**. Although they can be used in other ways, they typically contain default settings.

2. **Personal settings files**, named **myLeoSettings.leo**. They provide a way of ensuring that your customized settings are not altered when updating Leo from git or while installing a new version of Leo. The `myLeoSettings.leo` file acts much like Python's `site-customize.py` file. `myLeoSettings.leo` will never be part of any Leo distribution, and it will never exist in Leo's repository. This solution is *much* better than trying to update `leojsSettings.leojs` with scripts.

The following sections describe the kinds of nodes in `@settings` trees.

### Configuration directories

Settings files can be found in the following directories:

- **homeDir**, the `HOME/.leo` directory. HOME is given by Python's HOME environment variable, or by `g.os_path_expanduser('~')` if no HOME environment variable exists.

- **configDir**, Leo's configuration directory: `leo/config`.

- **machineDir**, the `HOME/.leo/MACHINE` directory. MACHINE is given by Python's `HOSTNAME` environment variable, or by Python's `COMPUTERNAME` environment variable if there is no `HOSTNAME` variable, or by the value returned by `socket.gethostname()` if neither environment variable exists.

- **localDir**, the directory containing the .leo file being loaded.

Leo reports in the Log pane window on startup and when opening .leo files what HOME dir is used and which settings files are read.

### Search order for settings files

When reading a .leo file, Leo looks for settings in default settings files first, then settings in personal settings files, and finally settings in local settings files.  The exact search order is:

.. Can't mix list and literal blocks.

**First**: Default settings files:

```
   configDir/leoSettings.leo
   homeDir/leoSettings.leo
   localDir/leoSettings.leo
```

**Second**: Personal settings files:

```
   configDir/myLeoSettings.leo
   homeDir/myLeoSettings.leo
   homeDir/<machine-name>LeoSettings.leo (note capitalization)
   localDir/myLeoSettings.leo
```

**Last**: Local settings files: the file being loaded.

Settings that appear later in this list override settings that appear earlier in this list.  This happens on a setting-by-setting basis, *not* on a file-by-file basis.  In other words, each individual setting overrides only the *corresponding* setting in previously-read files.  Reading a setting file does *not* reset all previous settings. Note that the same file might appear several times in the search list. Leo detects such duplicate file names and only loads each settings file once. Leo remembers all the settings in settings files and does not reread those settings when reading another .leo file.

**Caution**: This search order offers almost too much flexibility. This can be confusing, even for power users. It's important to choose the "simplest configuration scheme that could possibly work".  Something like:

- Use a single `leoSettings.leo` file for installation-wide defaults.
- Use a single `myLeoSettings.leo` files for personal defaults.
- Use local settings sparingly.

*Note*: it is good style to limit settings placed in `myLeoSettings.leo` to those settings that differ from default settings.

### Safe rules for local settings

You should use special care when placing default or personal settings files in **local** directories, that is, directories other than homeDir, configDir or machineDir. In particular, the value of localDir can change when Leo reads additional files. This can result in Leo finding new default and personal settings files. The values of these newly-read settings files will, as always, override any previously-read settings.

Let us say that a setting is **volatile** if it is different from a default setting. Let us say that settings file A.leo **covers** settings file if B.leo if all volatile settings in B.leo occur in A.leo. With these definitions, the **safe rule** for placing settings files in local directories is:

>   Settings files in local directories should
>   cover all other settings files.

Following this rule will ensure that the per-directory defaults specified in the local settings file will take precedence over all previously-read default and personal settings files. Ignore this principle at your peril.

### Organizer nodes

Organizer nodes have headlines that do no start with `@`. Organizer nodes may be inserted freely without changing the meaning of an `@setting` tree.

### \@ignore and \@if nodes

Leo ignores any subtree of an `@settings` tree whose headline starts with `@ignore`.

You can use several other kinds of nodes to cause Leo to ignore parts of an `@settings` tree:

- `@ifplatform <platform-name>`

  Same as `@if sys.platform == "platform-name"` except that it isn't necessary to import sys.

- `@ifhostname *hostA,!hostB*`

  Evaluates to True if and only if: `h=g.computeMachineName(); h==hostA and h!=hostB`. The `!` version allows matching to every machine name except the given one to allow differing settings on only a few machines.

### Simple settings nodes

Simple settings nodes have headlines of the form `@<type> name = val`.
These settings set the value of name to val, with the indicated type:

    | \<type\>          | Valid values                                                                                 |
    |:----------------|:-----------------------------------------------------------------------------------------------------------------------|
    | @bool           | True, False, 0, 1       |
    | @color          | A Qt color name or value, such as 'red' or 'xf2fddff' (without the quotes)       |
    | @directory      | A path to a directory       |
    | @float          | A floating point number of the form nn.ff.       |
    | @int            | An integer       |
    | @ints[list]     | An integer (must be one of the ints in the list). Example: @ints meaningOfLife[0,42,666]=42       |
    | @path           | A path to a directory or file       |
    | @ratio          | A floating point number between 0.0 and 1.0, inclusive.       |
    | @string         | A string       |
    | @strings[list]  | A string (must be one of the strings in the list). Example: @strings tk_relief['flat','groove','raised']='groove'       |

### Complex settings nodes

Complex settings nodes have headlines of the form `@<type> description`:

| @\<type\>              Valid values                                                        |
|---------------------:-------------------------------------------------------------------:|
| @buttons           | Child @button nodes create global buttons.                          |
| @commands          | Child @command nodes create global buttons.                         |
| @command-history   | Body is a list of commands pre-loaded into history list.            |
| @data              | Body is a list of strings, one per line.                            |
| @enabled-plugins   | Body is a list of enabled plugins.                                  |
| @font              | Body is a font description.                                         |
| @menus             | Child @menu and @item nodes create menus and menu items.            |
| @menuat            | Child @menu and @item nodes modify menu trees created by menus.     |
| @mode [name]       | Body is a list of shortcut specifiers.                              |
| @recentfiles       | Body is a list of file paths.                                       |
| @shortcuts         | Body is a list of shortcut specifies.                               |

Complex nodes specify settings in their body text.
See the following sections for details.

#### \@buttons

An `@buttons` tree in a settings file defines global buttons that are created in the icon area of all .leo files. All `@button` nodes in the `@commands` tree create global buttons. All `@button` nodes outside the commands tree create buttons local to the settings file.

#### \@commands

An `@commands` tree in a settings file defines global commands. All `@command` nodes in the `@commands` tree create global commands. All `@command` nodes outside the `@commands` tree create commands local to the settings file.

#### \@command-history
The body text contains a list of commands, one per line, to be preloaded into Leo's command history. You access command history using the up and down arrow keys in Leo's minibuffer.

#### \@data
The body text contains a list of strings, one per line. Lines starting with `#` are ignored.

#### \@rclick
For each `@button` node, Leo adds right-click menu items for:

- `@rclick` nodes directly *following* the `@button`.

- `@rclick` nodes that are *children* of the `@button` node, provided that the
  `@button` node has no `@others` directive.

**Standard rclick items**: Leo adds two standard right-click menu items for
each `@button` node: `Remove Button` and `Goto Script`. Leo adds the
indicator text **only** to buttons that contain right-click menu items in
addition to these two standard right-click menu items.

The headline of the `@rclick` node gives the menu title. The body contains a
Leo script to execute when the user selects the menu item.

**Related Setting**:

`@string mod_scripting_subtext = ▼`

This setting specifies **indicator text** that indicates that an `@button` button has right-click menu items created by `@rclick` nodes.

Unicode chars like `▼`, `▾` and `…` are typical choices for this text.

#### \@recentfiles
The body text contains a list of paths of recently opened files, one path per line. Leo writes the list of recent files to `.leoRecentFiles.txt` in Leo's config directory, again one file per line.

## Customizing the rst3 command

This section explains how to use **user filters** to alter the output of
the `rst3` command.

**Background**

The `rst3` command converts `@rst` trees containing [reStructuredText](https://docutils.sourceforge.io/rst.html) (rST)
or [Sphinx](https://www.sphinx-doc.org/en/master/) markup to an **intermediate string**. Depending on user
options, `rst3` will:

- write the intermediate string to an **intermediate file**.
- **NOT AVAILABLE IN LEOJS** ⚠️ send the intermediate string to [docutils](https://docutils.sourceforge.io) for conversion to HTML, PDF,
  [LaTeX](https://www.latex-project.org/), etc.

**User filters**

Plugins or scripts may define two functions: a **headline filter** and a
**body filter**:

- `rst3` calls the body filter for all nodes except descendants of
  `@rst-ignore` or `@rst-ignore-tree` nodes.

- `rst3` calls the headline filter for all nodes except::

    rst-no-head nodes or
    descendants of @rst-ignore or @rst-ignore-tree nodes.

- plugins or scripts register filters as follows::

    c.rstCommands.register_body_filter(body_filter)
    c.rstCommands.register_headline_filter(headline_filter)

- The signature of all filters is `filter-name (c, p)` where c and p are
  defined as usual.

**Example filters**

Do-nothing filters would be defined like this:

```python
def body_filter(c, p):
    return p.b

def headline_filter(c, p):
    return p.h
```

The following filters would simulate the frequently-requested "half clone" feature.
That is, within any `@rst` tree, the following filters would skip the children of all clones:

```python
def has_cloned_parent(c, p):
    """Return True if p has a cloned parent within the @rst tree."""
    root = c.rstCommands.root  # The @rst node.
    p = p.parent()
    while p and p != root:
        if p.isCloned():
            return True
        p.moveToParent()
    return False

def body_filter(c, p):
    return '' if has_cloned_parent(c, p) else p.b

def headline_filter(c, p):
    return '' if has_cloned_parent(c, p) else p.h
```

Folks, this might send a shiver down your spine. Both filters ignore all
descendants of clones in the `@rst` tree. We have the effect of half clones,
with no changes to Leo's core!

Note: `has_cloned_parent` stops the scan at the `@rst` node itself, ensuring
that the `rst3` command includes "top-level" clones themselves.

See `leo/plugins/example_rst_filter.py` for a complete example.

**Filters can do practically anything**

Filters can use the data in p.b, p.h, p.u, or p.gnx, but filters are not *limited* to the data in p. The has_cloned_parent filter shows that filters can access:

- Any ancestor or descendant of node p.
- Any data accessible from c, that is, *all* the data in the outline, including cached data!

Indeed, has_cloned_parent gets the current `@rst` node using `root = c.rstCommands.root`.

Moreover, filters can define special conventions, including:

- Special-format comments embedded in p.b,
- Special-purpose headlines.

**Summary**

Plugins and scripts can define headline and body filters that alter the intermediate string.

The `leo/plugins/example_rst_filter.py` plugin shows how to set up plugins that define custom filters.

Filters have easy access to all data within the outline, including:

- `c.rstCommands.root`, the `@rst` node containing p.
- All ancestors or descendants of p.
- All data contained *anywhere* in the outline.

The example filters shown above simulate the often-requested "half clone" feature.

## uA's: extensible attribues of nodes

Leo's .leo file format is extensible. The basis for extending .leo files are the v.unknownAttributes ivars of vnodes, also know as **user attributes**, uA's for short. Leo translates between uA's and xml attributes in the corresponding \<v\> elements in .leo files. Plugins may also use v.tempAttributes ivars to hold temporary information that will *not* be written to the .leo file. These two ivars are called **attribute ivars**.

Attribute ivars must be Python dictionaries, whose keys are names of plugins and whose values are *other* dictionaries, called **inner dictionaries**, for exclusive use of each plugin.

The v.u Python property allows plugins to get and set v.unknownAttributes easily:

```python
d = v.u # gets uA (the outer dict) for v
v.u = d # sets uA (the outer dict) for v
```

For example:

```python
plugin_name = 'xyzzy'
d = v.u # Get the outer dict.
inner_d = d.get(plugin_name,{}) # Get the inner dict.
inner_d ['duration']= 5
inner_d ['notes'] "This is a note."
d [plugin_name] = inner_d
v.u = d
```

No corresponding Python properties exist for v.tempAttributes, so the corresponding example would be::

```python
plugin_name = 'xyzzy'
# Get the outer dict.
if hasattr(p.v,'tempAttributes'): d = p.v.tempAttributes
else: d = {}
inner_d = d.get(plugin_name,{}) # Get the inner dict.
inner_d ['duration'] = 5
inner_d ['notes'] = "This is a note."
d [plugin_name] = inner_d
p.v.tempAttributes = d
```

**Important**: All members of inner dictionaries should be picklable: Leo uses Python's Pickle module to encode all values in these dictionaries. Leo will discard any attributes that can not be pickled. This should not be a major problem to plugins. For example, instead of putting a tnode into these dictionaries, a plugin could put the tnode's gnx (a string) in the dictionary.

**Note**: Leo does *not* pickle members of inner dictionaries whose name (key) starts with str\_. The values of such members should be a Python string. This convention allows strings to appear in .leo files in a more readable format.

Here is how Leo associates uA's with `<v>` elements in `.leo` files:

- **Native xml attributes** are the attributes of `<v>` elements that are known (treated specially) by Leo's read/write code. The native attributes of `<v>` elements are `a`, `t`, `vtag`, `tnodeList`, `marks`, `expanded`, and `descendentTnodeUnknownAttributes`. All other attributes of `<v>` and `<t>` elements are **foreign xml attributes**.

- When reading a `.leo` file, Leo will create v.unknownAttributes ivars for any vnode whose corresponding `<v>` or `<t>` element contains a foreign xml attribute.

- When writing a `.leo` file, Leo will write foreign xml attributes in `<v>` elements if the corresponding vnode contains an unknownAttributes ivar.

- Leo performs the usual xml escapes on these strings when reading or writing the unknownAttributes ivars.

## Decluttering headlines

**Decluttering** replaces controls custom formatting of headlines, including:

- Hiding or changing headline text,
- Adding icons to headlines,
- Changing the styling of headlines.

Decluttering is *inactive* when you are editing a headline.

Decluttering is *completely optional*. To enable decluttering, use:

```
@bool tree-declutter = True
```

Decluttering is controlled by **decluttering rulesets**.
You specify decluttering rulesets in the body text of:

```
@data tree-declutter-patterns
```

As usual with `@data` nodes:

- Blank lines and lines starting with `#` are ignored.
- You may organize the text of the `@data` node using child nodes.

Each ruleset consists of a list of lines:

- The first line is a **rule line**, containing a **find pattern**.
- The second line is a **replacement line**.
- The ruleset ends with zero or more **style lines**.

Find patterns are [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).
Decluttering affects only those headlines that match a rule pattern. 

The following section shows some example rulesets. Later sections discuss decluttering commands, patterns and styles in more detail.

### Examples

Here are some examples of decluttering rulesets:

```
# Hide org-mode tags and bold the headline.
RULE :([\w_@]+:)+\s*$
REPLACE-HEAD
WEIGHT Bold

# Replace @clean with an icon
RULE ^@clean (.*)
REPLACE \1
ICON file_icons/file_clean.png

# Show the last part of long filenames
RULE ^.{1,1000}([/\\])(.{25})
REPLACE …\1\2
```

### Rule & replacement lines
All rulesets start with a **rule line** of the form:

```
RULE <regular expression>
```

The ruleset matches a headline if and only if the regular expression matches. Matches can start anywhere in the headline. Leo first attempts to a match using re.match. If that doesn't work, Leo tries re.search.

A **replacement line** must follow the rule line. Here are the valid forms::

```
REPLACE <substitution expression>
REPLACE-HEAD
REPLACE-TAIL
REPLACE-REST
```

- `REPLACE` replaces the headline by the value of the substitution expression.  For example:

```
REPLACE \1
```

  matches replaces the headline by the first matched regex group.

- `REPLACE-HEAD` replaces replace the headline by the text that precedes the matched text.

- `REPLACE-TAIL` replaces the headline by the text that follows the matched text.

- `REPLACE-REST` replaces the headline by everything except the matched text.

### Style lines

Leo applies style lines only if they appear in a ruleset that matches a headline. Style lines do the following...

Add an icon to the headline:

```
    ICON path/to/icon
```

Set the background or foreground color to a color number or names:

```
    BG #FF8800
    FG @solarized-magenta
```

Set the font to a given font name:

```
    Font Times
```

Set the font size in pixels (PX) or points (PT):

```
    PX 40
    PT 16
```

Enable or disable italics:

```
    ITALIC 0
    ITALIC 1
```

Set the font weight to one of Light, Normal, DemiBold, Bold, Black:

```
    WEIGHT DemiBold
```
