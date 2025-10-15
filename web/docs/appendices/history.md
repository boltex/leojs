---
sidebar_position: 4
toc_max_heading_level: 3
---

# History of Leo
![alt text](img/edward-k-ream.jpg#author)

This section delves into the rich history of Leo, as narrated by its original author, **Edward K. Ream.** Through his perspective, you'll gain insights into the development journey, key milestones, and the vision that shaped Leo into what it is today.

It discusses the most important milestones in the history of Leo and summarizes each of Leo's public releases.  The focus is on the *important* and *interesting* developments.  It is not a chronicle of every change made to Leo.

## The Early Days

One of Leo's most important developments, `@button`, came directly from e's `dyna_menu` plugin. The exact date seems lost, but it certainly existed by Leo 4.3.

### 1995: Beginnings

Leo grew out of my efforts to use Donald Knuth's "CWEB system of Structured documentation." I had known of literate programming since the mid 1980's, but I never understood how to make it work for me. In November 1995 I started thinking about programming in earnest. Over the holidays I mused about making programs more understandable.

### 1996: Breakthroughs

In January 1996 the fog of confusion suddenly cleared. I summarized my thinking with the phrase, **web are outlines in disguise**. I suspected that outline views were the key to programming, but many details remained obscure.

March 5, 1996, is the most important date in Leo's history. While returning from a day of skiing, I discussed my thoughts with Rebecca. During that conversation I realized that I could use the MORE outliner as a prototype for a "programming outliner." I immediately started work on my first outlined program. It quickly became apparent that outlines work: all my old problems with programming vanished. The @others directive dates from this day. I realized that MORE's outlines could form the basis for Leo's screen design. Rather than opening body text within the outline, as MORE does, I decided to use a separate body pane.

I hacked a translator called M2C which allowed me to use MORE to write real code. I would write code in MORE, copy the text to the clipboard in MORE format, then run M2C, which would convert the outline into C code. This process was useful, if clumsy. I called the language used in the outline SWEB, for simplified CWEB. Much later Leo started supporting the noweb language.

### 1996-1998: Apple and YellowBox

Throughout 1996 I created a version of Leo on the Macintosh in plain C and the native Mac Toolbox. This was a poor choice; I wasted a huge amount of time programming with these primitive tools. However, this effort convinced me that Leo was a great way to program.

Late in 1997 I wrote a Print command to typeset an outline. Printing (Weaving) is supposedly a key feature of literate programming. Imagine my surprise when I realized that such a "beautiful" program listing was almost unintelligible; all the structure inherent in the outline was lost! I saw clearly that typesetting, no matter how well done, is no substitute for explicit structure.

In 1998 I created a version of Leo using Apple's YellowBox environment. Alas, Apple broke its promises to Apple developers. I had to start again.

### 1999-2001: Borland C++

In May of 1999 I began work on the Borland version of Leo for Windows. Borland C++ was much better than CodeWarrior C, but it was still C++. Still, the Borland Delphi classes were a pleasure to use and free of bugs. I redesigned Leo's file format for the Windows version of Leo; the Yellow Box file format was a binary format that requires the Yellow Box runtime.

There are two significant problems with the Borland version of Leo. First, it works only on Windows. Second, it can never be Open software, because it uses Borland's Delphi classes and a commercial syntax coloring component.

This version of Leo was the first version to use xml as the format of .leo files. Marc-Antoine Parent urged me to use XML and patiently explained how to use XML properly.

### 2001: Discovering Python

I attended the Python conference in early 2001. In May of 2000 I began work on a wxWindows version of Leo. The wxWindows project failed in a useful way. While adding python scripting, I became familiar with Python and its internals.

I started to 'get' Python in September 2001. In October of 2001 I began work on leo.py, based on Tk. The rewrite took only two months! leo.py 0.05 alpha went out the door on December 17, 2001.

I wrote the white papers around this time. Python solved *all* my programming problems. I was no longer anxious while programming; it simply isn't possible to create hard-to-find bugs in Python.

### 2001: Putting sentinel lines in external files

In the summer of 2001 I began to consider using sentinel lines in external files. Previously I had thought that outline structure must be 'protected' by remaining inside .leo files. Accepting the possibility that sentinels might be corrupted opened vast new design possibilities. In retrospect, problems with sentinels almost never happen, but that wasn't obvious at the time! The result of this design was known then as Leo2. That terminology is extinct. I think of this version as the first version to support @file and automatic tangling and untangling.

#### Overview

The following sections describe the complexities that were involved in designing Leo's simple-looking mechanisms. They give a pseudo-chronological list of the major Aha's involved in creating Leo2. These Aha's form the real design and theory of operation of Leo. 

I am writing these notes for several reasons. First, the initial design and coding of Leo2, spanning a period of about 8 weeks, was some of the most creative and rewarding work I have ever done. The result is elegant and simple. I'm proud of it. Second, much of the design work is not reflected in the code, because improved design often eliminated code entirely. The final code is so elegant that it obscures the hard work that created it. Third, you must understand this design in order to understand the implementation of @file trees and their external files. Someday someone else may take charge of Leo. That person should know what really makes Leo work.

#### First steps

In the summer of 2001 I began work on a project that for a long time I had considered impossible. I had long considered that "private" file formats such as .leo files were the only way to represent an outline properly and safely. I'm not sure what changed my mind, but I finally was willing to consider that information embedded in external files might be useful. This meant accepting the possibility that sentinel lines might be corrupted. This was a crucial first step. If we can trust the user not to corrupt sentinel lines than we can embed almost any kind of information into a external file.

There were several motivations for this work. I wanted to eliminate the need for explicit Tangle and Untangle commands. I thought of this as "Untangle on Read/Tangle on Write." If tangling and untangling could be made automatic it would save the user a lot of work. I also wanted to make external files the primary sources files. .leo files might be made much smaller external files contained the primary source information. This hope turned out to be false.

The result of this design work was something I originally called Leo2. Now, I prefer to talk about @file trees. Initially most design issues were unresolved or unknown. I resolved to attempt a robust error-recovery scheme, not knowing in advance what that might involve. I also wanted to solve what I thought of as the "cross-file clone" problem: clones that point from a .leo outline into a external file. With Leo1 cross-file clones do not exist; everything is in the same .leo file. It was clear that Leo2 would have to change some aspects of clones, but all details were fuzzy.

#### A prototype: simplified noweb

The next step was also crucial. I started to use Leo1 as a prototype to design what the new body pane would look like to the user. In retrospect, using Leo1 as a prototype for Leo2 was just as inspired as using MORE as a prototype for Leo1. Both prototypes marked the true beginning of their respective projects. The Leo2 prototype was a mockup in Python of the code for reading and writing derived files.

Writing the prototype got me thinking about improving noweb. With my experience with Leo1, I was able to create a new markup language that took advantage of outline structure. I called the new language "simplified noweb", though that terminology is obsolete. I created @file nodes to distinguish between the old and new ways of creating external files. In Leo1, the @code directive is simply an abbreviation for a section definition line. Simplified noweb used @c as an abbreviation for @code. More importantly, simplified noweb used @c to separate doc parts from code parts without necessarily specifying a section name. It quickly became apparent that most nodes could be unnamed. All I needed was the @others directive to specify the location for all such unnamed nodes.

From the start, simplified noweb was a joy to use. The @others directive could replace all section definition lines. Furthermore, I could make @doc directive optional if the body pane started in "code mode". But this meant that plain body text could become a program! This was an amazing discovery. These Aha's got me excited about Leo2. This was important, as it motivated me to do a lot of difficult design work.

#### Avoiding error notifications

In spite of this excitement, I was uneasy. After much "daydreaming" I realized that I was afraid that reading and writing external files would be interrupted by a long series of alerts. I saw that designing the "user interaction" during reading and writing would be very important. The next Aha was that I could replace a long series of alerts with messages to the log window, followed by a single "summary" alert. Much later I saw how to eliminate alerts entirely.

At this time I thought there would be two kinds of "errors" while reading external files. Warnings would alert the user that something non-serious had happened. True errors would alert the user that data might have been lost. Indeed, if Leo2 saves orphan and ignored nodes in a .leo file under an @file node, then read errors could endanger such nodes. Much later I saw that a robust error recovery scheme demands that @file nodes not contain orphan and @ignored nodes. (More on this subject later.) But if orphan and @ignored nodes are moved out of @file trees, there are no read errors that can cause data loss! So the distinction between warnings and errors finally went away.

#### The write code

I next turned my attention to writing @file nodes. A huge Aha: I realized that sentinel lines must contain both a leading and a trailing newline. The general principle is this: the write code must contain absolutely no "conditional" logic, because otherwise the read code could not figure out whether the condition should be true or false. So external files contain blank lines between sentinel lines. These "extra" newlines are very useful, because the read (untangle) code can now easily determine exactly where every blank, tab and newline of the external file came from. It would be hard to overstate how important this simplifying principle was in practice.

Much later, with urging from a customer, I realized that the write code could safely remove "extra" newlines between sentinels with a caching scheme in the low level atFile::os() routine. This scheme does not alter the body of the write code in any way: in effect, sentinels still contain leading and trailing "logical" newlines. The read code had to be modified to handle "missing" leading newlines, but this can always be done assuming that sentinels still contain logical leading and trailing newlines!

At about this time I designed a clever way of having the write code tell the read code which newlines were inserted in doc parts. (The whole point of doc parts is to have the write code format long comments by splitting long lines.) To quote from my diary:

"We can use the following convention to determine where putDocPart has inserted line breaks: A line in a doc part is followed by an inserted newline if and only if the newline is preceded by whitespace. This is an elegant convention, and is essentially invisible to the user. Tangle outputs words until the line would become too long, and then it inserts a newline. To preserve all whitespace, tangle always includes the whitespace that terminates a word on the same line as the word itself. Therefore, split lines always end in whitespace. To make this convention work, tangle only has to delete the trailing whitespace of all lines that are followed by a 'real' newline."

#### The read code

After the write code was working I turned my attention to the read (untangle) code. Leo's Untangle command is the most complex and difficult code I have ever written. Imagine my surprise when I realized that the Leo2 read code is essentially trivial! Indeed, the Leo2 untangle code is like an assembler. The read code scans lines of a external files looking for "opcodes", that is, sentinel lines, and executes some simple code for each separate opcode. The heart of this code is the scanText routine in atFile.cpp.

The read code was written and debugged in less than two days! It is the most elegant code I have ever written. While perfecting the read code I realized that sentinel lines should show the complete nesting structure found in the outline, even if this information seems redundant. For example, I was tempted to use a single sentinel to represent an @other directive, but finally abandoned this plan in favor of the @+other and @-other sentinels.

This redundancy greatly simplified the read code and made the structure of external files absolutely clear. Moreover, it turned out that we need, in general, all the information created by the present sentinel lines. In short, sentinels are as simple as they can be, and no simpler.

The atFile::createNthChild method is a very important: it ensures that nodes will be correctly inserted into the outline. createNthChild must be bullet-proof if the Read code is to be robust. Note that the write code outputs @node sentinels, that is, section definitions, in the order in which sections are referenced in the outline, not the order in which sections appear in the outline. So createNthChild must insert the n'th node of parent p properly even if p contains fewer than n-1 children! The write code ensures that section references are properly nested: @node sentinels are enclosed in @node sentinels for all their ancestors in the @file tree. createNthChild creates dummy siblings as needed, then replaces the dummy siblings later when their actual definitions, that is, @node sentinels, are encountered.

At this point the fundamental read/write code was complete. I found three minor bugs in the code over the next week or so, but it was clear that the read/write code formed a rock-solid base from which to continue design and implementation. This was an entirely unexpected surprise.

#### The load/save code

At this point I could read and write external files "by hand", using temporary Read and Write commands. The next step was to integrate the reading and writing of external files with the loading and saving of .leo files. From time to time I made minor changes to the drivers for the read/write code to accommodate the Load and Save code, but at no time did I significantly alter the read or write code itself.

The user interaction of the Load and Save commands drove the design and implementation of the load/store code. The most important questions were: "what do we tell the user?", and "what does the user do with the information?" It turns out that the user can't make any complex decision during error recovery because the user doesn't have nearly enough information to make an informed choice. In turn, this means that certain kinds of error recovery schemes are out of the question...

#### Attributes, mirroring and dummy nodes

I now turned my attention to "attributes" of nodes. Most attributes, like user marks, are non-essential. However, clone information is essential; we must never lose clone links. At this time I had a preliminary design for cross-file clones that involved a two part "pointer" consisting of a full path name and an immutable clone index within the external file. Eventually such pointers completely disappeared, but the immutable clone indices remain.

My first thought was that it would be good to store all attributes in @node sentinels in the external file, but experience showed that would be irritating. Indeed, one wants Leo2 to rewrite external files only if something essential has changed. For example, one doesn't want to rewrite the external file just because a different node as been selected.

At this point I had another Aha: we can use the .leo file to store all non-essential attributes. For example, this means that the .leo file, not the external files, will change if we select a new node. In effect, the .leo file mirrors the external file. The only reason to store nodes in the .leo file under an @file node is to carry these attributes, so Leo2 wrote dummy nodes that do not reference body text. Much later I saw that dummy nodes were dangerous and that .leo files should contain all information found in external files.

#### Clones

The concept of mirroring created a huge breakthrough with cross-file clones: Here is an excerpt of an email i sent to my brother Speed:

"I realized this morning that since a .leo file contains dummy vnodes for all nodes in a external file, those dummy nodes can carry clone info! I changed one line to make sure that the write code always writes clone info in dummy vnodes and voila! Cross-file clones worked!"

All of Leo1's clone code could be used completely unchanged. Everything "just works".

#### Error recovery, at last

At first I thought we could make sure that the .leo file always correctly mirrors all external file, but disastrous experience showed that is a completely false hope. Indeed, backup .leo files will almost never mirror external file correctly. So it became urgent to find a completely fool-proof error recovery scheme.

I had known for quite a while that error recovery should work "as if" the mirroring nodes were deleted, then recreated afresh. Several failed attempts at an error recovery scheme convinced me that error recovery would actually have to delete all dummy nodes and then do a complete reread. This is what Leo2 does.

But erasing dummy nodes would destroy any orphan and ignored nodes--by definition such nodes appear nowhere in the external file. Therefore, I had to enforce the rule that @file nodes should contain no such nodes. Here is an email I wrote to my brother, Speed Ream discussing what turned out to be the penultimate error recovery scheme:

"The error recovery saga continues. After much pondering and some trial coding I have changed my mind about orphans and @ignored nodes. They simply should never appear as descendants of @file nodes. Fortunately, this simplifies all aspects of Leo2. Leo2 will issue a warning (not an error) if an orphan or @ignored node appears as the descendant of an @file node when a .leo file is being saved. If any warnings occur while writing the external file, Leo2 will write the "offending" @file tree to the .leo file instead of the external file. This has several advantages:

1. The user gets warned about orphan nodes. These are useful warnings! Orphan nodes arise from missing @others directives or missing section references.

2. The user doesn't have to change anything immediately in order to save an outline. This is very important. Besides warnings about orphans, Leo2 will also warn about undefined or unreferenced sections. User's shouldn't have to fix these warnings to do a Save!

3. No errors or alerts will occur during Reading or Writing, so the user's anxiety level goes way down. At worst, some informational message will be sent to the log. The user will never have to make important decisions during Loads or Saves. [At last the dubious distinction between errors and warnings disappears.]

4. Error recovery can be bullet-proof. Simple code will guarantee that after any read operation the structure of an @file node will match the structure of the external file. Also, sentinels in external files will now account for all children of an @file node. There are no more "missing nodes" that must be filled in using the .leo file. Finally, error recovery will never change the @file tree in any way: no more "recovered nodes" nodes.

5. The present read code can be used almost unchanged. The only addition is the posting of a warning if the structure of the .leo file does not match the structure of the external file. We need a warning because non-essential attribute of nodes (like user marks) may be altered."

This ends the original history of Leo2. In fact, it took quite a while before Leo recovered properly from all errors. I finally saw that .leo files should duplicate all information in external files. This allows a .leo file to be used a single backup file and allows maximal error recovery in all situations. It took several months to stamp out several subtle bugs involving clones that caused spurious read errors. Such errors undermine confidence in Leo and can cause disastrous reversions. See my diary entries for January 2002 in leo.py for details.

### 2002: Untangling @file is easy!

The biggest surprise in Leo's history was the realization it is **much** easier to untangle files derived from @file. Indeed, the old tangle code created all sorts of problems that just disappear when using @file. The new Python version of Leo became fully operational in early 2002. It was probably about this time that I chose noweb as Leo's preferred markup language. My decision not to support noweb's escape sequences made Leo's read code much more robust.

### 2002: Leo 3.x: Continuous improvement

I spent 2002 taking advantages of Python's tremendous power and safety. Many improvements were at last easy enough to do:

- Leo 3.2: Add nested `@others` directives.
- Leo 3.3: Add unicode support.
- Leo 3.7: Add `@first` and `@last` directives.
- Leo 3.8: Add `@asis` and `@nosent` directives.
- Leo 3.9: Add incremental syntax coloring and incremental undo.

### 2003: SourceForge: new energy

I registered the Leo project on SourceForge on March 10, 2003. Leo started a new life shortly thereafter. Prior to SourceForge my interest in Leo had been waning.

### 2003: 4.0: New read logic eliminates read errors, eliminated child indices

4.0 final: October 17, 2003.

In late 2002 and throughout 2003 I worked on an entirely new file format. 

Version 4.0 is a major advance in Leo's error handling. Using 4.0 is much safer than all previous versions. The new read code makes no changes to the outline until it is known that no read errors have occurred.

This was a time of intense design work trying to improve error recovery scheme used while reading external files. In the summer of 2003 I realized that orphan and @ignore'd nodes must be prohibited in @file trees. With this restriction, Leo could finally recreate @file trees in outlines using **only** the information in external files. This made the read code much more robust, and eliminated all the previous unworkable error recovery schemes. At last Leo was on a completely firm foundation.

Leo's read code now writes a message to the log pane whenever it sees that the body text in the external file does not match the body text in the outline. These messages do not indicate errors, only that the body text has been changed outside of Leo.

Leo's read code now warns if any non-empty node is unvisited. This check, and the check that headlines match pretty much guarantees that out-of-sync outlines will generate errors. Thus, there is no need a gnx timestamp in @+leo sentinels!

- Add support for uA's.
- Eliminate child indices, extraneous blank lines and @body sentinels.
- Eliminate @node sentinels.
- Add `@nl` and `@nonl` sentinels.
- Read errors leave the outline completely unchanged.

### 2004: 4.1: The debut of gnx's

Leo 4.1, February 20, 2004.

This release reorganized the code base to support gui's other than tkinter.

Leo first used gnx's (global node indices) as a foolproof way of associating nodes in .leo files with nodes in external files. At the time, there was still intense discussions about protecting the logical consistency of outlines. @thin was later to solve all those problems, but nobody knew that then.

### 2004: 4.2: generators, uA's the end of sync problems, shared tnodes

Leo 4.2, September 20, 2004.

This is one of the most significant dates in Leo's history. There were so many significant changes that it is hard to remember what Leo was like before it.

Leo 4.2 eliminated worries about consistency of outlines and external files: Leo recreates all essential information from @thin files, so *there is nothing left in the .leo file to get out of sync*. Thin external files use gnx's extensively. This simplifies the file format and makes thin external files more cvs friendly.

Leo 4.2 forms the **great divide** in Leo's internal data structures. Before 4.2, Leo every node in the outline had its own vnode. This was a big performance problem: clone operations had to traverse the entire outline!

4.2 represents clones by sharing subtrees. Kent Tenney and Bernhard Mulder made absolutely crucial contributions. Kent pointed out that it is a tnode, not a vnode that must form the root of the shared data. Bernhard showed that iterators avoid creating huge numbers of positions.

- Add `@all`, `@test` and `@suite`.
- Add `mod_scripting` plugin.
- Add new generators.

### 2005: 4.3: @settings trees, plugins manager, predefined c, g, p

Leo 4.3 (May 23, 2005) and Leo 4.3.3 (September 17, 2005):

Leo 4.3 introduced settings files. These files replaced config.txt and made settings completely extensible and flexible. This release also introduced the ill-fated settings pane. It was soon retired because it inhibited development.

- Add the `PluginsManager` plugin. Thank you Paul Patterson!
- Predefine `c`, `g` and `p` in scripts and `@test` nodes
- Add the `rst3` plugin.

### 2006: 4.4: The minibuffer, key bindings autocompletion, multiple log panes

Leo 4.4, May 11, 2006:

Leo 4.4 completed a year-long effort to incorporate an Emacs-style minibuffer and related commands into Leo. Leo 4.4 also featured many improvements in how keys are bound to commands, including per-pane bindings and user-defined key-binding modes. These features allow users to emulate Emacs, Vim, or any other editor. They also make it easy to use Leo without a mouse.

This release created many Emacs-like commands, including cursor and screen movement, basic character, word and paragraph manipulation, and commands to manipulate buffers, the kill ring, regions and rectangles. Much of the work started with a prototype by LeoUser (B.H).

- The **New World Order**: drawing happens immediately, not at idle time.
- The **Newer World Order**: c.endUpdate is equivalent to `c.redraw_now`.
- Add a tabbed log pane.
- Add autocompletion and calltips.

Development on long-delayed projects accelerated after 4.4.

## Later developments

### 2006-2008: 4.4.x: Hundreds of improvements

This series of releases featured hundreds of improvements.

Leo 4.4.1 (August 30, 2006) and Leo 4.4.2.1 (October 29, 2006):

- Add a new colorizer controlled by jEdit language description files.
- Add the `leoPymacs` module, allowing Leonine scripts within Emacs.

Leo 4.4.3 (June 26, 2006) and Leo 4.4.3.1 (July 3, 2006):

- The **big reorg** made the vnode and tnode classes completely independent of the rest of Leo.
- Add chapters, the `leoBridge` module, and spell checking.

Leo 4.4.4 (November 2, 2007): Add `@auto`, `menus` and `buttons`.

Leo 4.4.7 (February 18, 2008): Add the `ipython` plugin, a collaboration between EKR and Ville M. Vainio.

Leo 4.4.8 (April 6, 2008): Host Leo's forum on Google Groups.

### 2009: 4.6: Qt gui, @edit, @auto-rst

Leo 4.6 (July 15, 2009) and Leo 4.6.1 (July 30, 2009):

- Use Qt by default.
- Add ``@auto-rst`` and ``@edit``.

### 2010: 4.7: The one node world & Python 3k

Leo 4.7: February 23, 2010. Leo 4.7.1: February 26, 2010.

Leo 4.7 accomplishes something I long thought to be impossible: the unification of vnodes and tnodes. tnodes no longer exist: vnodes contain all data. The Aha that made this possible is that iterators and positions allow a single node to appear in more than one place in a tree traversal.

This was one of the most significant developments in Leo's history. At last the endless confusion between vnodes and tnodes is gone. At the most fundamental level, Leo's data structures are as simple as possible. This makes them as general and as powerful as possible!

- A single code base runs on both Python 2 and 3.
- Leo automatically converts from old-style to new-style sentinels.

### 2010: 4.8: New sentinels & recovery nodes

Leo 4.8 (November 26, 2010):

This release simplified Leo's sentinels as much as possible. This version also added "Resurrected" and "Recovered" nodes. These nodes protect against data loss, and also implicitly warn when unusual data-changing events occur. Creating this scheme was yet another chapter in the epic saga of error recovery in Leo.

### 2011: 4.9: The end of Tk, autocompleter, vr pane

Leo 4.9 (June 21, 2011): The rendering pane can now display movies, html, svg images, etc.

### 2014: 5.0 Vim mode, plays well with others

Leo 5.0 (November 24, 2014): Leo now stores "ephemeral" or position-related data *in vnodes*. This was a completely new idea in Leo's history!

### 2015: 5.1 @clean

Leo 5.1 (April 16, 2015) added ``@clean`` and the Mulder/Ream update algorithm.

In February 2015 I realized that the ``@shadow`` algorithm could be used to update ``@clean`` (aka ``@nosent``) files. This inspired me to simplify the ``@shadow`` update algorithm. The Mulder/Ream algorithm emerged several days later.

Thinking of using Leo as a diff program *might* have been the line of thought that lead to ``@clean``. It turned my attention to the ``@shadow`` algorithm, and that may have been enough to see that the algorithm could get sentinels from the ``.leo`` file instead of hidden shadow files.

I'll probably never be able to recreate a clearer picture of how the Aha came to be. That's the nature of big Aha's: they obliterate previous ways of thought so completely that it's hard to remember the time before the Aha.

The following paragraphs explain why ``@clean`` is one of the most important developments in Leo's history.

#### Steve Zatz: in praise of @clean

I just want to provide my own thoughts about the importance of `@clean`. I look at the posts in this group a fair amount because I find the discussion interesting but I had abandoned leo as a day-to-day tool principally because of the sentinels in `@file` nodes. Even for solo projects, I just found them visually unappealing and beyond that occasionally confusing when I went to edit files with external editors. I would sometimes start a project in leo, particularly if it was based on code I developed in the past using leo, and then would use the old `@nosent` to save a version of the code without sentinels and then use my external editor of choice and not use leo at all. I missed many of the features of leo but just couldn't get over the sentinel issue.

`@clean` really seems to solve all the issues that I had. In particular--and somehow this point doesn't seem to me to have been emphasized enough--it seems to fully support organizer nodes. They are one of the great things about leo--it's happy to guess initially at what the structure of your program is but it's completely up to you to determine the structure and the ability to do things like break up long methods, group like methods, group menu actions in GUI code, etc etc is one of the very cool things about leo. My limited but growing experience with `@clean`'s handling of external changes has been mainly with incremental (as opposed to more sweeping) code changes, and the assignment of new lines is reasonable and you can always fix them it quickly if you don't like how external changes have been handled.

There have been some posts about the recovered nodes, comparing the old and new nodes where there were external changes. I think it's genius. As opposed to hoping that leo has correctly incorporated external changes, it's all there in case you want to take a closer look. Without this, I would just not have the confidence that external changes were being applied correctly and while you can always do a git diff, I am not looking to do that every time I change a file externally especially if I am not at the point where I am about to do a commit.

There has been some discussion of `@auto` v. `@clean`. Preference is obviously a matter of taste. I will say that for me the fact that node headlines are unaffected by external file changes is a feature not a problem since I place notes in the headlines that I want preserved when I edit files externally. Yes, if the node headlines are the method names then they won't be updated if an external edit changes a method name but this was true of `@file` as well.

The ability to work on projects with people who don't have leo is obvious; one perhaps slightly less obvious benefit of no sentinels is that I suspect that the likelihood that someone will clone a git repository is reduced when that repository's code is riddled with leo sentinels (unless the potential cloner is a leo loyalist). The one downside to no sentinels--there is no evidence that leo is being used but I think that raises the broader question of marketing leo, which I certainly believe will be aided significantly by being able to take advantage of leo without sentinels in external files.

#### EKR: Why @clean is so important

`@clean` is the long-sought breakthrough that just might allow Leo to "go viral". For the very first time, Leo can be used in *all* situations without compromise.  There is no longer any need to make excuses for sentinel lines, or argue whether people should accept them.  Sentinels are simply gone.

I have just realized how inconvenient sentinels might be for my *own* work flow.  This was a shocking revelation. To illustrate, here is an excerpt from the programming tutorial:

When I study other people's code I do the following:

- Create a git repo of the directory to be studied, adding all the source files and doing an initial commit.

- Use a [recursive import script](../advanced-topics/scripting-guide.md#recursive-import-script) to create the desired `@clean` nodes.

- Explicitly save all the imported files using `Ctrl-Shift-W` (`write-at-file-nodes`).

- Use [git](https://git-scm.com/) diff to ensure that no important changes have been made while importing the nodes.

- Use git diff to track any changes I make (such as adding tracing or debugging statements) for the purposes of studying the code. Using `@clean` is an essential part of this work flow. The diffs would be much harder to read if I had imported files into `@file` trees instead.

In short, I have just now realized how badly sentinels interfered with git diffs.

### 2016-2018: 5.2 through 5.9: precursors to LeoInteg

This "fallow" period prepared contained important performance improvements and paved the way for `leoInteg`.

An acknowledgment is appropriate here. About this time, Vitalije Milosevic (Виталије Милошевић) insisted that Leo's code could be improved by removing kwargs. Yes, doing so requires duplicating code, but the resulting simplicity is almost always significant. In many cases, the simplifications ripple throughout Leo's codebase. These simplifications continue to the present day.

Vitalije also suggested that local helper functions would also improve Leo's code. I use this pattern less often, but it too has its place.

Leo 5.4 (October 22, 2016): Add `clone-find` commands.

Leo 5.5 (March 23, 2017): A bug fix made syntax coloring 20x faster!

Leo 5.6 (September 25, 2017):

- Add the `git-diff` command.
- Add the `cursesGui2.py` plugin. This plugin contained the `p_to_ap` and
  `ap_to_p` functions that became crucial parts of `leoInteg`.

Leo 5.8 (October 1, 2018): Replace caching with Vitalije's super-fast read code.

Leo 5.9 (May 1, 2019): Add `LeoWapp.py`, Leo in a browser.

### 2019-2023: Leo 6.0 through 6.7: LeoInteg

August, 2020: edreamleo's first PR. Félix Malboeuf encouraged me to use PRs for all significant code changes.

Around this time Félix started a careful code review of *all* of Leo's core, including many plugins. This ongoing review found many "quirps" and some larger bugs.

6.2 (March 27, 2020): The rise of f-strings in Leo. How did I ever live without them?

6.3 (November 6, 2020): `leoAst.py`.

June 21, 2021: The dawn of `LeoInteg`: The first commit by Félix Malboeuf for leoserver.py, a stand-alone server for Leo.

6.4 (September 20, 2021): The first release supporting `LeoInteg`: integration of Leo with VS code. `LeoInteg` and `LeoJS` are the future of Leo. All later releases contain support for `LeoInteg` and `LeoJS`. This was the first release containing leoserver.py.

Sep 24, 2021: Félix releases LeoInteg 1.0, with this [announcement](https://groups.google.com/g/leo-editor/c/8SPF7GFo5f4/m/GcaWR7ohBQAJ).

This is one of the most important dates in Leo's history:

- LeoInteg promises to make millions of people aware of Leo.
  One click in `vs-code` installs `LeoInteg`.
- `LeoJS` will allow Leo to run in a browser!
- `LeoInteg` brings all of `vs-code`'s features to Leo. For example, there
  are several vim-emulator modes for `vs-code`, each much better than Leo's vim mode.

Leo on vs-code means that Leo will live on. Nothing lasts forever, but when IDE's become obsolete, the replacement might build on `vs-code` and Leo. That's pretty close to immortality in my book.

6.5: (October 22, 2021): Removed `@test/@suite`, fixing the biggest mistake I ever made with Leo. It was shocking how much *harder* `@test` made unit testing! The `create_app` function in leoTest2.py allows Leo to use python's `unittest` module.

6.7.0 (September 26, 2022): Fully annotate Leo's core files and important plugins.

6.7.4 (August 17, 2023) A spectacular collapse in the importer architecture. The Aha! Use **guide lines** to make parsing incoming lines easier.

### 2024 onward: Leo 6.8: Easy layouts, @jupytext, @leo
Leo 6.8.0 (July 3, 2024):

A new framework for layouts replaces the free_layout and nested_splitter plugins.
The gui "Easter Egg" is no more.

Jul 27, 2024: Félix releases LeoJS 1.0, with this
[announcement](https://groups.google.com/g/leo-editor/c/nNSaJTMAB3s/m/Df1roWA5AgAJ)
along with a [scripting samples repository](https://github.com/boltex/scripting-samples-leojs?tab=readme-ov-file#how-to-use-on-the-web-in-your-browser)
and a [dedicated website](https://boltex.github.io/leojs/).

LeoJS is a JavaScript implementation of Leo's original Python source packaged as a VSCode extension. It is also usable with VSCode for the web.

Leo 6.8.2 (November 8, 2024):

@jupytext uses the jupytext library https://jupytext.readthedocs.io/en/latest/ to handle Jupyter Notebooks seemlessly.

Leo 6.8.6: (August 1, 2025):

- @leo and related commands makes it easy to use Leo on huge repositories.
- LeoInteg (and leoserver.py) supports websockets.

## Acknowledgements

From the movie, My Cousin Vinny:

<ul>
    Mona Lisa Vito: So what's your problem?\
    Vinny Gambini: My problem is, I wanted to win my first case
    without any help from anybody.\
    Mona Lisa: Well, I guess that plan's moot.\
    Vinny : Yeah.\
    Mona Lisa: You know, this could be a sign of things to come.
    You win all your cases, but with somebody else's help, right?
    You win case after case, and then afterwards you have to go up
    to somebody and you have to say, "thank you."\
    [pause]\
    Oh my God, what a fucking nightmare!
</ul>

### Leo and More

Leo owes much of its visual design to MORE, possibly the most elegant computer program ever written.

More inspired Leo's cloned nodes.

### Leo's vips

Leo's very important people:

- David Brock wrote TSyntaxMemo, used in early versions of Leo.
- Terry Brown wrote important plugins, including Leo's user-modifiable panes.
- e inspired @button nodes, a brilliant idea.
- The late Bob Fitzwater kept me focused on design.\
  Oh, how I wish he could see today's Leo.
- Jonathan M. Gilligan showed how to put the Leo icon in Leo's windows.
- The Jupyter development team taught me how to support pygments colorizing.
- Brian Harry contributed numerous plugins, including a prototype for Leo's minibuffer, and wrote jyLeo: Leo in Jython.
- Almar Klein wrote pyzo, yoton and flexx, the basis of LeoWapp (--gui=browser).
- Donald Knuth invented the CWEB language and literate programming.
- The late Bernhard Mulder invented the @shadow algorithm, the foundation of @clean.\
  Bernhard also inspired Leo's generators and position class.
- Joe Orr created LeoVue and XSLT stylesheets for Leo.
- John K. Ousterhout created tcl/Tk, used in early versions of Leo.
- Виталије Милошевић, (Vitalije Milosevic) made vital code-level contributions.
- Tsuchi Noko created transparent icons.
- Neal Norwitz wrote PyChecker.
- Félix Malboeuf wrote LeoInteg, LeoJS, leoserver.py and leoclient.py.
- Marc-Antoine Parent urged me to use XML for Leo's file format and helped improve it.
- Paul Paterson created the plugin architecture, helped with spell checking and contributed many plugins.
- François Pinard wrote pymacs, the foundation of Leo's emacs bridge.
- Norman Ramsey created noweb and gave permission to quote from the noweb web documentation.
- Edward K. Ream is Leo's project leader and chief programmer.
- Rich Ries has contributed a huge number of suggestions.
- Guido van Rossum created Python.
- Steven P. Schaefer pointed out security problems.
- Gil Shwartz helped with unicode support.
- Phil Straus has been a great friend and constant support.
- Kent Tenney contributed key insights about vnodes and lobbied to make Leo easier to use.
- Ville M. Vainio contributed to the one-node world, the IPython bridge and several plugins.
- Paul S. Wilson greatly improved Leo's Wikipedia entry.
- Dave Winer created MORE, the foundation of Leo's visual design.
- Dan Winkler helped support Leo on the Mac.

Special thanks to my family. My brother, David Speed Ream, tested Leo and made many useful suggestions. Rebecca, James and Linda make it all worthwhile. During a conversation with Rebecca I realized that MORE could be used as a prototype for Leo. That was a crucial first step.

### Contributors

The following people reported bugs, answered questions, and made suggestions for improving Leo:

<ul>
Alex Abacus, Shakeeb Alireze, Steve Allen, Bruce Arnold, Chris Barker, Dennis Benzinger, David Boddie, Jason Breti, Eric Brown, Terry Brown, Darius Clarke, Martin Clifford, Jason Cunliffe, Josef Dalcolmo, Gil Dev, Bill Drissel, Wenshan Du, Allen Edwards, Chris Elliot, Dethe Elza, Reinhard Engle, Mark Engleberg, Roger Erens, Stephen Ferg, Tom Fetherston, Tomaz Ficko, Niklas Frykholm, Fred Gansevles, Jonathan M. Gilligan, Zak Greant, Thomas Guettler, Romain Guy, Dave Hein, Tiago Castro Henriques, Gary Herron, Steve Holden, Klass Holwerda, Matthias Huening, Robert Hustead, John Jacob, Paul Jaros, Christopher P. Jobling, Eric S. Johansson, Garold Johnson, James Kerwin, Nicola Larosa, David LeBlanc, Chris Liechti, Steve Litt, Martin v. Löwis, Robert Low, Fredrik Lundh, Michael Manti, Alex Martelli, Marcus A. Martin, Gidion May, David McNab, Frank Merenda, Martin Montcrieffe, Will Munslow, Lewis Neal, Chad Netzer, Derick van Niekerk, Jeff Nowland, Naud Olivier, Joe Orr, Marc-Antoine Parent, Paul Paterson, Sean Shaleh Perry, Tim Peters, David Priest, Gary Poster, Scott Powell, Bruce Rafnel, Walter H. Rauser, Olivier Ravard, David Speed Ream, Rich Ries, Aharon Robbins, Guido van Rossum, David Rowe, Davide Salomoni, Steven Schaefer,Johannes Schöön, Wolfram Schwenzer, Casey Wong Kam Shun, Gil Shwartz, Jim Sizelove, Paul Snively, Jurjen Stellingwerff, Phil Straus, David Szent-Györgyi, Kent Tenney, Jeffrey Thompson, Gabriel Valiente, Jim Vickroy, Tony Vignaux, Tom van Vleck, Kevin Walzer, Ying-Chao Wang, Cliff Wells, Dan Wharton, John Wiegley, Wim Wijnders, Dan Winkler, Vadim Zeitlin.
</ul>
