"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[424],{4221:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>l,default:()=>c,frontMatter:()=>t,metadata:()=>a,toc:()=>h});var i=s(4848),r=s(8453);const t={sidebar_position:3},l="The Mulder/Ream algorithm",a={id:"appendices/mulder-ream",title:"The Mulder/Ream algorithm",description:"This appendix documents the Mulder/Ream update algorithm in detail, with an informal proof of its correctness.",source:"@site/docs/appendices/mulder-ream.md",sourceDirName:"appendices",slug:"/appendices/mulder-ream",permalink:"/leojs/docs/appendices/mulder-ream",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"appendicesSidebar",previous:{title:"Format of External Files",permalink:"/leojs/docs/appendices/format-of-external-files"},next:{title:"History of Leo",permalink:"/leojs/docs/appendices/history"}},o={},h=[{value:"What the algorithm does",id:"what-the-algorithm-does",level:2},{value:"Guesses don&#39;t matter",id:"guesses-dont-matter",level:2},{value:"Background of the code",id:"background-of-the-code",level:2},{value:"Aha: the x.sentinels array",id:"aha-the-xsentinels-array",level:2},{value:"Strategy &amp; proof of correctness",id:"strategy--proof-of-correctness",level:2},{value:"Summary",id:"summary",level:2}];function d(e){const n={a:"a",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"the-mulderream-algorithm",children:"The Mulder/Ream algorithm"})}),"\n",(0,i.jsx)(n.p,{children:"This appendix documents the Mulder/Ream update algorithm in detail, with an informal proof of its correctness."}),"\n",(0,i.jsx)(n.p,{children:"Prior to Leo 5.1, Leo used Bernhard Mulder's original algorithm to read @shadow files. Starting with Leo 5.1, Leo uses this algorithm to read both @clean and @shadow files. Conceptually, both algorithms work as described in the next section."}),"\n",(0,i.jsx)(n.p,{children:"In February 2015 EKR realized that the @shadow algorithm could be used to update @clean (@nosent) files. Simplifying the algorithm instantly became a top priority. The new code emerged several days later, made possible by the x.sentinels array. It is an important milestone in Leo's history."}),"\n",(0,i.jsx)(n.h2,{id:"what-the-algorithm-does",children:"What the algorithm does"}),"\n",(0,i.jsx)(n.p,{children:"For simplicity, this discussion will assume that we are updating an\r\nexternal file, x, created with @clean x. The update algorithm works\r\nexactly the same way with @shadow trees."}),"\n",(0,i.jsxs)(n.p,{children:["The algorithm works with ",(0,i.jsx)(n.em,{children:"any"})," kind of text file. The algorithm uses only\r\ndifflib. It knows nothing about the text or its meaning. No parsing is ever\r\ndone."]}),"\n",(0,i.jsx)(n.p,{children:"Suppose file x has been changed outside of Leo. When Leo reads x it does\r\nthe following:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Recreates the ",(0,i.jsx)(n.em,{children:"old"})," version of x ",(0,i.jsx)(n.em,{children:"without"})," sentinels by writing the\r\n@clean x ",(0,i.jsx)(n.em,{children:"outline"})," into a string, as if it were writing the @clean x\r\noutline again."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Recreates all the lines of x ",(0,i.jsx)(n.em,{children:"with"})," sentinels by writing the @clean x\r\n",(0,i.jsx)(n.em,{children:"outline"})," into a string, as if it was writing an @file node! Let's call\r\nthese lines the ",(0,i.jsx)(n.strong,{children:"old sentinels"})," lines."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Uses difflib.SequenceMatcher to create a set of diffs between the\r\nold and new versions of x ",(0,i.jsx)(n.em,{children:"without"})," sentinels."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Terminology"}),": the diffs tell how to change file a into file b. The\r\nactual code uses this terminology: ",(0,i.jsx)(n.strong,{children:"a"})," is set of lines in the old\r\nversion of x, ",(0,i.jsx)(n.strong,{children:"b"})," is the set of lines in the new version of x."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Creates a set of lines, the ",(0,i.jsx)(n.strong,{children:"new sentinels lines"})," using the old\r\nsentinels lines, the a and b lines and the diffs."]}),"\n",(0,i.jsxs)(n.p,{children:["This is the magic. Bernhard Mulder's genius was conceiving that a\r\nthree-way merge of lines could produce the new outline, ",(0,i.jsx)(n.em,{children:"with"}),"\r\nsentinels. The code is in x.propagate_changed_lines and its helpers."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Replaces the @clean tree with the new tree created by reading the new\r\nsentinels lines with the @file read logic."}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Important"}),": The update algorithm never changes sentinels. It never\r\ninserts or deletes nodes. The user is responsible for creating nodes to\r\nhold new lines, or for deleting nodes that become empty as the result of\r\ndeleting lines."]}),"\n",(0,i.jsx)(n.h2,{id:"guesses-dont-matter",children:"Guesses don't matter"}),"\n",(0,i.jsxs)(n.p,{children:["There are several boundary cases that the update algorithm can not resolve.\r\nFor example, if a line is inserted between nodes, the algorithm can not\r\ndetermine whether the line should be inserted at the end of one node or the\r\nstart of the next node. Let us call such lines ",(0,i.jsx)(n.strong,{children:"ambiguous lines"}),"."]}),"\n",(0,i.jsxs)(n.p,{children:["The algorithm ",(0,i.jsx)(n.em,{children:"guesses"})," that ambiguous lines belongs at the end of a node\r\nrather than at the start of the next node. This is usually what is\r\nwanted--we usually insert lines at the end of a node."]}),"\n",(0,i.jsxs)(n.p,{children:["Happily, ",(0,i.jsx)(n.strong,{children:"guesses don't matter"}),", for the following reasons:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["The external file that results from writing the @clean x tree will be\r\nthe same as the updated external file ",(0,i.jsx)(n.em,{children:"no matter where"})," ambiguous lines\r\nare placed. In other words, the update algorithm is ",(0,i.jsx)(n.strong,{children:"sound"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Leo reports nodes that were changed when reading any external file. The\r\nuser can review changes to @clean and @file trees in the same way."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["The user can permanently correct any mistaken guess. Guesses only happen\r\nfor ",(0,i.jsx)(n.em,{children:"newly inserted or changed"})," lines. Moving an ambiguous line to the\r\nfollowing node will not change the external file. As a result, the\r\nnext time Leo reads the file the line will be placed in the correct node!"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"This proves that @shadow and @clean are easy and safe to use. The\r\nremaining sections of this document discuss code-level details."}),"\n",(0,i.jsx)(n.h2,{id:"background-of-the-code",children:"Background of the code"}),"\n",(0,i.jsxs)(n.p,{children:["The algorithm depends on three simple, guaranteed, properties of\r\nSequenceMatcher.opcodes. See\r\n",(0,i.jsx)(n.a,{href:"https://docs.python.org/2/library/difflib.html#sequencematcher-examples",children:"https://docs.python.org/2/library/difflib.html#sequencematcher-examples"})]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Fact 1"}),": The opcodes tell how to turn x.a (a list of lines) into x.b\r\n(another list of lines)."]}),"\n",(0,i.jsx)(n.p,{children:"The code uses the a and b terminology. It's concise and easy to remember."}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Fact 2"}),": The opcode indices ai, aj, bi, bj ",(0,i.jsx)(n.em,{children:"never"})," change because\r\nneither x.a nor x.b changes."]}),"\n",(0,i.jsx)(n.p,{children:"Plain lines of the result can be built up by copying lines from x.b to x.results::"}),"\n",(0,i.jsxs)(n.p,{children:["'replace'   x.results.extend(x.b[b1",":b2","])\r\n'delete'    do nothing  (b1 == b2)\r\n'insert'    x.results.extend(x.b[b1",":b2","])\r\n'equal'     x.results.extend(x.b[b1",":b2","])"]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Fact 3"}),": The opcodes ",(0,i.jsx)(n.em,{children:"cover"})," both x.a and x.b, in order, without any gaps."]}),"\n",(0,i.jsx)(n.p,{children:"This is an explicit requirement of sm.get_opcode:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"The first tuple has ai==aj==bi==bj==0."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Remaining tuples have ai == (aj from the preceding tuple) and bi == (bj\r\nfrom the previous tuple)."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"Keep in mind this crucial picture:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The slices x.a[ai",":aj","] cover the x.a array, in order without gaps."]}),"\n",(0,i.jsxs)(n.li,{children:["The slices x.b[bi",":bj","] cover the x.b array, in order without gaps."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"aha-the-xsentinels-array",children:"Aha: the x.sentinels array"}),"\n",(0,i.jsxs)(n.p,{children:["Mulder's original algorithm was hard to understand or to change. The\r\nculprit was the x.mapping array, which mapped indices into arrays of lines\r\n",(0,i.jsx)(n.em,{children:"with"})," sentinels to indices into arrays of lines ",(0,i.jsx)(n.em,{children:"without"})," sentinels."]}),"\n",(0,i.jsx)(n.p,{children:"The new algorithm replaces the x.mapping array with the x.sentinels array.\r\nAs a result, diff indices never need to be adjusted and handling diff\r\nopcodes is easy."}),"\n",(0,i.jsxs)(n.p,{children:["For any index i, x.sentinels[i] is the (possibly empty) list of sentinel\r\nlines that precede line a[i]. Computing x.sentinels from old_private_lines\r\nis easy. Crucially, x.a and x.sentinels are ",(0,i.jsx)(n.em,{children:"parallel arrays"}),". That is,\r\nlen(x.a) == len(x.sentinels), so indices into x.a are ",(0,i.jsx)(n.em,{children:"also"})," indices into\r\nx.sentinels."]}),"\n",(0,i.jsx)(n.h2,{id:"strategy--proof-of-correctness",children:"Strategy & proof of correctness"}),"\n",(0,i.jsx)(n.p,{children:"Given the x.sentinels array, the strategy for creating the results is\r\nsimple. Given indices ai, aj, bi, bj from an opcode, the algorithm:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Writes sentinels from x.sentinels[i], for i in range(ai,aj)."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Writes plain lines from b[i], for i in range(bi,bj)."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:'This "just works" because the indices cover both a and b.'}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"The algorithm writes sentinels exactly once (in order) because each\r\nsentinel appears in x.sentinels[i] for some i in range(len(x.a))."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"The algorithm writes plain lines exactly once (in order) because\r\neach plain line appears in x.b[i] for some i in range(len(x.b))."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"This completes an informal proof of the correctness of the algorithm."}),"\n",(0,i.jsx)(n.p,{children:"The leading and trailing sentinels lines are easy special cases. This\r\ncode, appearing before the main loop, ensures that leading lines are\r\nwritten first, and only once::"}),"\n",(0,i.jsx)(n.p,{children:"x.put_sentinels(0)\r\nx.sentinels[0] = []"}),"\n",(0,i.jsx)(n.p,{children:"Similarly, this line, at the end of the main loop, writes trailing\r\nsentinels::"}),"\n",(0,i.jsx)(n.p,{children:"x.results.extend(x.trailing_sentinels)"}),"\n",(0,i.jsx)(n.h2,{id:"summary",children:"Summary"}),"\n",(0,i.jsxs)(n.p,{children:["The algorithm creates an updated set of lines ",(0,i.jsx)(n.em,{children:"with"})," sentinels using the\r\n@clean outline and the updated external file. These new lines then replace\r\nthe original @clean with a new @clean tree. The algorithm uses only\r\ndifflib. It will work with ",(0,i.jsx)(n.em,{children:"any"})," kind of text file. No knowledge of any\r\nlanguage is needed."]}),"\n",(0,i.jsx)(n.p,{children:"The algorithm depends on simple, guaranteed, properties of indices in\r\nSequenceMatcher opcodes."}),"\n",(0,i.jsx)(n.p,{children:"The algorithm steps through x.sentinels and x.b, extending x.results\r\nas it goes."}),"\n",(0,i.jsx)(n.p,{children:"The algorithm gets all needed data directly from opcode indices into\r\nx.sentinels and x.b. Using opcode indices requires neither reader\r\nclasses nor auxiliary indices."})]})}function c(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>l,x:()=>a});var i=s(6540);const r={},t=i.createContext(r);function l(e){const n=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),i.createElement(t.Provider,{value:n},e.children)}}}]);