---
sidebar_position: 3
---

# The Mulder/Ream algorithm

This appendix documents the Mulder/Ream update algorithm in detail, with an informal proof of its correctness.

Prior to Leo 5.1, Leo used Bernhard Mulder's original algorithm to read @shadow files. Starting with Leo 5.1, Leo uses this algorithm to read both @clean and @shadow files. Conceptually, both algorithms work as described in the next section.

In February 2015 EKR realized that the @shadow algorithm could be used to update @clean (@nosent) files. Simplifying the algorithm instantly became a top priority. The new code emerged several days later, made possible by the x.sentinels array. It is an important milestone in Leo's history.

## What the algorithm does

For simplicity, this discussion will assume that we are updating an
external file, x, created with @clean x. The update algorithm works
exactly the same way with @shadow trees.

The algorithm works with *any* kind of text file. The algorithm uses only
difflib. It knows nothing about the text or its meaning. No parsing is ever
done.

Suppose file x has been changed outside of Leo. When Leo reads x it does
the following:

1. Recreates the *old* version of x *without* sentinels by writing the
   @clean x *outline* into a string, as if it were writing the @clean x
   outline again.

2. Recreates all the lines of x *with* sentinels by writing the @clean x
   *outline* into a string, as if it was writing an @file node! Let's call
   these lines the **old sentinels** lines.

3. Uses difflib.SequenceMatcher to create a set of diffs between the
   old and new versions of x *without* sentinels.

   **Terminology**: the diffs tell how to change file a into file b. The
   actual code uses this terminology: **a** is set of lines in the old
   version of x, **b** is the set of lines in the new version of x.

4. Creates a set of lines, the **new sentinels lines** using the old
   sentinels lines, the a and b lines and the diffs.

   This is the magic. Bernhard Mulder's genius was conceiving that a
   three-way merge of lines could produce the new outline, *with*
   sentinels. The code is in x.propagate_changed_lines and its helpers.

5. Replaces the @clean tree with the new tree created by reading the new
   sentinels lines with the @file read logic.

**Important**: The update algorithm never changes sentinels. It never
inserts or deletes nodes. The user is responsible for creating nodes to
hold new lines, or for deleting nodes that become empty as the result of
deleting lines.

## Guesses don't matter

There are several boundary cases that the update algorithm can not resolve.
For example, if a line is inserted between nodes, the algorithm can not
determine whether the line should be inserted at the end of one node or the
start of the next node. Let us call such lines **ambiguous lines**.

The algorithm *guesses* that ambiguous lines belongs at the end of a node
rather than at the start of the next node. This is usually what is
wanted--we usually insert lines at the end of a node.

Happily, **guesses don't matter**, for the following reasons:

1. The external file that results from writing the @clean x tree will be
   the same as the updated external file *no matter where* ambiguous lines
   are placed. In other words, the update algorithm is **sound**.

2. Leo reports nodes that were changed when reading any external file. The
   user can review changes to @clean and @file trees in the same way.

3. The user can permanently correct any mistaken guess. Guesses only happen
   for *newly inserted or changed* lines. Moving an ambiguous line to the
   following node will not change the external file. As a result, the
   next time Leo reads the file the line will be placed in the correct node!

This proves that @shadow and @clean are easy and safe to use. The
remaining sections of this document discuss code-level details.

## Background of the code

The algorithm depends on three simple, guaranteed, properties of
SequenceMatcher.opcodes. See
[https://docs.python.org/2/library/difflib.html#sequencematcher-examples](https://docs.python.org/2/library/difflib.html#sequencematcher-examples)

**Fact 1**: The opcodes tell how to turn x.a (a list of lines) into x.b
(another list of lines).

The code uses the a and b terminology. It's concise and easy to remember.

**Fact 2**: The opcode indices ai, aj, bi, bj *never* change because
neither x.a nor x.b changes.

Plain lines of the result can be built up by copying lines from x.b to x.results:

    'replace'   x.results.extend(x.b[b1:b2])
    'delete'    do nothing  (b1 == b2)
    'insert'    x.results.extend(x.b[b1:b2])
    'equal'     x.results.extend(x.b[b1:b2])

**Fact 3**: The opcodes *cover* both x.a and x.b, in order, without any gaps.

This is an explicit requirement of sm.get_opcode:

- The first tuple has ai==aj==bi==bj==0.

- Remaining tuples have ai == (aj from the preceding tuple) and bi == (bj
  from the previous tuple).

Keep in mind this crucial picture:

- The slices x.a[ai:aj] cover the x.a array, in order without gaps.
- The slices x.b[bi:bj] cover the x.b array, in order without gaps.

## Aha: the x.sentinels array

Mulder's original algorithm was hard to understand or to change. The
culprit was the x.mapping array, which mapped indices into arrays of lines
*with* sentinels to indices into arrays of lines *without* sentinels.

The new algorithm replaces the x.mapping array with the x.sentinels array.
As a result, diff indices never need to be adjusted and handling diff
opcodes is easy.

For any index i, x.sentinels[i] is the (possibly empty) list of sentinel
lines that precede line a[i]. Computing x.sentinels from old_private_lines
is easy. Crucially, x.a and x.sentinels are *parallel arrays*. That is,
len(x.a) == len(x.sentinels), so indices into x.a are *also* indices into
x.sentinels.

## Strategy & proof of correctness

Given the x.sentinels array, the strategy for creating the results is
simple. Given indices ai, aj, bi, bj from an opcode, the algorithm:

- Writes sentinels from x.sentinels[i], for i in range(ai,aj).

- Writes plain lines from b[i], for i in range(bi,bj).

This "just works" because the indices cover both a and b.

- The algorithm writes sentinels exactly once (in order) because each
  sentinel appears in x.sentinels[i] for some i in range(len(x.a)).

- The algorithm writes plain lines exactly once (in order) because
  each plain line appears in x.b[i] for some i in range(len(x.b)).

This completes an informal proof of the correctness of the algorithm.

The leading and trailing sentinels lines are easy special cases. This
code, appearing before the main loop, ensures that leading lines are
written first, and only once:

    x.put_sentinels(0)
    x.sentinels[0] = []

Similarly, this line, at the end of the main loop, writes trailing
sentinels:

    x.results.extend(x.trailing_sentinels)

## Summary

The algorithm creates an updated set of lines *with* sentinels using the
@clean outline and the updated external file. These new lines then replace
the original @clean with a new @clean tree. The algorithm uses only
difflib. It will work with *any* kind of text file. No knowledge of any
language is needed.

The algorithm depends on simple, guaranteed, properties of indices in
SequenceMatcher opcodes.

The algorithm steps through x.sentinels and x.b, extending x.results
as it goes.

The algorithm gets all needed data directly from opcode indices into
x.sentinels and x.b. Using opcode indices requires neither reader
classes nor auxiliary indices.
