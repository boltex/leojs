---
sidebar_position: 4
---

# The Leonine way to refactor code

This paper explains how to use cff (clone-find-flattened) while
refactoring code. I could not have completed the refactoring of Leo's
atFile write code without using continuous, extensive use of cff.

There are two key ideas:

1. The clones produced by cff are short-term or medium-term data,
   easily created and easily dispensed with.

Such clones are valuable, but not precious. They will eventually be discarded.

2. Unlike tags (or any other kind of non-Leonine data), the clones
   produced by cff can be reorganized.

This is the priceless, unique advantage of clones.  You don't understand clones if you don't get this.

**Example:**

1. While refactoring, it is essential to see all actual uses of a
   symbol (method, or ivar, whatever).

The starting point is to use cff to find all potential uses of the
symbol. If multiple files or classes use the symbol, you can use the
suboutline-only option to limit the matches created by cff.

2. After finding all potential uses of the symbol, you can reorganize
   the resulting clones as follows:

- Delete nodes that are completely irrelevant.
- Squirrel away likely-irrelevant nodes in a new organizer node.
- Highlight the defining node, say by making it the preceding sibling of the cff node.
- Leave all actual uses of the symbol where they are.

3. You have now focused your attention on the nodes that will likely
   change.

You can now rerun the search only on those cloned nodes to see all
instances of the symbol that might be changed. This is a crucial
double check on proposed changes.
