"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[971],{

/***/ 1483:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assets: () => (/* binding */ assets),
/* harmony export */   contentTitle: () => (/* binding */ contentTitle),
/* harmony export */   "default": () => (/* binding */ MDXContent),
/* harmony export */   frontMatter: () => (/* binding */ frontMatter),
/* harmony export */   metadata: () => (/* binding */ metadata),
/* harmony export */   toc: () => (/* binding */ toc)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var _mdx_js_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8453);


const frontMatter = {
	sidebar_position: 1
};
const contentTitle = 'Leo Scripting Guide';
const metadata = {
  "id": "advanced-topics/scripting-guide",
  "title": "Leo Scripting Guide",
  "description": "This chapter covers miscellaneous topics related to Leo scripts.",
  "source": "@site/docs/advanced-topics/scripting-guide.md",
  "sourceDirName": "advanced-topics",
  "slug": "/advanced-topics/scripting-guide",
  "permalink": "/leojs/docs/advanced-topics/scripting-guide",
  "draft": false,
  "unlisted": false,
  "tags": [],
  "version": "current",
  "sidebarPosition": 1,
  "frontMatter": {
    "sidebar_position": 1
  },
  "sidebar": "advancedTopicsSidebar",
  "next": {
    "title": "Writing Plugins",
    "permalink": "/leojs/docs/advanced-topics/writing-plugins"
  }
};
const assets = {

};



const toc = [{
  "value": "@button example",
  "id": "button-example",
  "level": 2
}, {
  "value": "Submenus with @rclick",
  "id": "submenus-with-rclick",
  "level": 2
}, {
  "value": "Comparing two similar outlines",
  "id": "comparing-two-similar-outlines",
  "level": 2
}, {
  "value": "Converting Body Text To Title Case",
  "id": "converting-body-text-to-title-case",
  "level": 2
}, {
  "value": "Creating minimal outlines",
  "id": "creating-minimal-outlines",
  "level": 2
}, {
  "value": "Cutting and pasting text",
  "id": "cutting-and-pasting-text",
  "level": 2
}, {
  "value": "g.app.gui.run* methods run dialogs",
  "id": "gappguirun-methods-run-dialogs",
  "level": 2
}, {
  "value": "Getting commander preferences",
  "id": "getting-commander-preferences",
  "level": 2
}, {
  "value": "Getting configuration settings",
  "id": "getting-configuration-settings",
  "level": 2
}, {
  "value": "Getting interactive input",
  "id": "getting-interactive-input",
  "level": 2
}, {
  "value": "Invoking commands from scripts",
  "id": "invoking-commands-from-scripts",
  "level": 2
}, {
  "value": "Making operations undoable",
  "id": "making-operations-undoable",
  "level": 2
}, {
  "value": "Modifying the body pane directly",
  "id": "modifying-the-body-pane-directly",
  "level": 2
}, {
  "value": "Recovering vnodes",
  "id": "recovering-vnodes",
  "level": 2
}, {
  "value": "Recursive import script",
  "id": "recursive-import-script",
  "level": 2
}, {
  "value": "Running code at idle time",
  "id": "running-code-at-idle-time",
  "level": 2
}, {
  "value": "Running code in separate processes",
  "id": "running-code-in-separate-processes",
  "level": 2
}, {
  "value": "Using child_process.exec",
  "id": "using-child_processexec",
  "level": 3
}, {
  "value": "Call child_process.exec directly",
  "id": "call-child_processexec-directly",
  "level": 4
}, {
  "value": "Call g.execute_shell_commands",
  "id": "call-gexecute_shell_commands",
  "level": 4
}, {
  "value": "Call g.execute_shell_commands_with_options",
  "id": "call-gexecute_shell_commands_with_options",
  "level": 4
}, {
  "value": "Using g.execute_shell_commands",
  "id": "using-gexecute_shell_commands",
  "level": 3
}, {
  "value": "Working with directives and paths",
  "id": "working-with-directives-and-paths",
  "level": 2
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    blockquote: "blockquote",
    br: "br",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    header: "header",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_1__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
    children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.header, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h1, {
        id: "leo-scripting-guide",
        children: "Leo Scripting Guide"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "This chapter covers miscellaneous topics related to Leo scripts."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "You might call this a FAQ for scripts..."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["💡 ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "UI INTERACTIONS"
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "For LeoJS UI interaction examples, see the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
            href: "https://github.com/boltex/scripting-samples-leojs",
            children: "scripting samples repository"
          })
        }), ", along with the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
          href: "https://www.youtube.com/watch?v=M_mKXSbVGdE",
          children: "LeoJS features video"
        }), " to see how to try them directly in your browser."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "button-example",
      children: "@button example"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Here is an example, @button promote-child-bodies:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "/**\r\n * Copy the body text of all children to the parent's body text.\r\n */\r\n\r\n// Great for creating what's new nodes.\r\nconst result: string[] = [p.b];\r\nconst b = c.undoer.beforeChangeNodeContents(p);\r\n\r\nfor (const child of p.children()) {\r\n    if (child.b) {\r\n        result.push(`\\n- ${child.h}\\n\\n${child.b}\\n`);\r\n    } else {\r\n        result.push(`\\n- ${child.h}\\n\\n`);\r\n    }\r\n}\r\n\r\np.b = result.join('');\r\nc.undoer.afterChangeNodeContents(p, 'promote-child-bodies', b);\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "This creates a fully undoable promote-child-bodies command."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "submenus-with-rclick",
      children: "Submenus with @rclick"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["You can make ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@button"
      }), " offer sub-menus with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@rclick"
      }), " nodes."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["See ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/customizing#rclick",
        children: "@button and @rclick"
      }), " for more\r\ndetails, and the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "https://github.com/boltex/scripting-samples-leojs",
        children: "LeoJS scripting samples"
      }), "\r\nfor examples of using  ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@button"
      }), " nodes."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "comparing-two-similar-outlines",
      children: "Comparing two similar outlines"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "efc.compareTrees does most of the work of comparing two similar outlines.\r\nFor example, here is \"@button compare vr-controller\" in leoPyRef.leo:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "const p1 = g.findNodeAnywhere(c, 'class ViewRenderedController (QWidget) (vr)');\r\nconst p2 = g.findNodeAnywhere(c, 'class ViewRenderedController (QWidget) (vr2)');\r\ng.assert(p1.v && p2.v);\r\nconst tag = 'compare vr1 & vr2';\r\nc.editFileCommands.compareTrees(p1, p2, tag);\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "This script will compare the trees whose roots are p1 and p2 and show the results like \"Recovered nodes\".  That is, the script creates a node called \"compare vr1 & vr2\".  This top-level node contains one child node for every node that is different.  Each child node contains a diff of the node.  The grand children are one or two clones of the changed or inserted node."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "converting-body-text-to-title-case",
      children: "Converting Body Text To Title Case"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Title case means that all words start with capital letters.  The\r\nfollowing script converts the selected body text to title case.  If\r\nnothing has been selected, the entire current node is converted. The\r\nconversion is undoable:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "const w = c.frame.body.wrapper;\r\nconst p = c.p;\r\nlet s = p.b;\r\nconst u = c.undoer;\r\n\r\nconst [start, end] = w.getSelectionRange();\r\nconst use_entire = start === end; // no selection, convert entire body\r\n\r\nconst undoType = 'title-case-body-selection';\r\nconst undoData = u.beforeChangeNodeContents(p);\r\n\r\nfunction toTitleCase(str: string): string {\r\n    return str.replace(/\\w\\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());\r\n}\r\n\r\nif (use_entire) {\r\n    p.b = toTitleCase(s);\r\n} else {\r\n    const sel = s.slice(start, end);\r\n    const head = s.slice(0, start);\r\n    const tail = s.slice(end);\r\n    p.b = head + toTitleCase(sel) + tail;\r\n}\r\n\r\nc.setChanged();\r\np.setDirty();\r\nu.afterChangeNodeContents(p, undoType, undoData);\r\nc.redraw();\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.em, {
          children: ["Contributed by ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
            href: "https://github.com/tbpassin",
            children: "T. B. Passin"
          })]
        })
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "creating-minimal-outlines",
      children: "Creating minimal outlines"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The following script will create a minimal Leo outline:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "let c2: Commands;\r\n\r\nif (true) {\r\n    // Create a visible frame.\r\n    c2 = g.app.newCommander('');\r\n} else {\r\n    // Create an invisible frame.\r\n    c2 = g.app.newCommander('', g.app.nullGui);\r\n}\r\n\r\nc2.frame.createFirstTreeNode();\r\nc2.redraw();\r\n\r\n// Test that the script works.\r\nfor (const p of c2.all_positions()) {\r\n    g.es(p.h);\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "cutting-and-pasting-text",
      children: "Cutting and pasting text"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The following shows how to cut and paste text to the clipboard:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "await g.app.gui.replaceClipboardWith('hi');\r\ng.es(g.app.gui.getTextFromClipboard());\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "gappguirun-methods-run-dialogs",
      children: "g.app.gui.run* methods run dialogs"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Scripts can invoke various dialogs using the following methods of the g.app.gui object."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "//  VSCode Wrapper for showInputBox, or, for showQuickPick if tabList is given:\r\ng.app.get1Arg(\r\n    options?: vscode.InputBoxOptions | vscode.QuickPickOptions,\r\n    token?: vscode.CancellationToken,\r\n    tabList?: string[]\r\n)\r\n\r\n// Utility dialogs:\r\ng.app.gui.runAskOkDialog(\r\n    c: Commands,\r\n    title: string,\r\n    message: string,\r\n    text = \"Ok\"\r\n)\r\ng.app.gui.runAskYesNoCancelDialog(\r\n    c: Commands,\r\n    title: string,\r\n    message: string,\r\n    yesMessage = 'Yes',\r\n    noMessage = 'No',\r\n    yesToAllMessage = \"\",\r\n    defaultButton = 'Yes',\r\n    cancelMessage = \"\"\r\n)\r\ng.app.gui.runAskYesNoDialog(        \r\n    c: Commands,\r\n    title: string,\r\n    message: string,\r\n    yes_all = false,\r\n    no_all = false\r\n)\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The values returned are in ('ok','yes','no','cancel'), as indicated by the method names. Some dialogs also return strings or numbers, again as indicated by their names."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Scripts can run File Open and Save dialogs with these methods:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "// Single select dialog\r\ng.app.gui.runOpenFileDialog(\r\n    c: Commands,\r\n    title: string,\r\n    filetypes: [string, string][],\r\n)\r\n// Multiple select dialog\r\ng.app.gui.runOpenFilesDialog(\r\n    c: Commands,\r\n    title: string,\r\n    filetypes: [string, string][],\r\n)\r\n\r\n// Save as... dialog\r\ng.app.gui.runSaveFileDialog(\r\n    c: Commands,\r\n    title: string,\r\n    filetypes: [string, string][],   \r\n)\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "For details about how to use these file dialogs, look for examples in Leo's own source code."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "getting-commander-preferences",
      children: "Getting commander preferences"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Each commander sets ivars corresponding to settings."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Scripts can get the following ivars of the Commands class:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "const ivars = [\r\n    'output_doc_flag',\r\n    'page_width',\r\n    'tab_width',\r\n    'target_language',\r\n    'use_header_flag',\r\n];\r\n\r\ng.es(\"Prefs ivars...\\n\");\r\n\r\nfor (const ivar of ivars) {\r\n    g.es((c as any)[ivar]);\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "getting-configuration-settings",
      children: "Getting configuration settings"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Settings may be different for each commander."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The c.config class has the following getters:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getBool(settingName,default=None)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getColor(settingName)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getDirectory(settingName)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getFloat(settingName)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getInt(settingName)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getLanguage(settingName)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getRatio(settingName)"
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "c.config.getString(settingName)"
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "These methods return undefined if no setting exists."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The getBool 'default' argument to getBool specifies the value to be returned if the setting does not exist."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "getting-interactive-input",
      children: "Getting interactive input"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "g.app.gui.get1Arg"
      }), " method is a Wrapper for VSCode's showInputBox, or, for showQuickPick if tabList is given."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Example 1: get one argument from the user:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "@cmd('my-command', 'My Command Description')\r\npublic async myCommand(): Promise<unknown> {\r\n\r\n    const arg = await g.app.gui.get1Arg({\r\n        title: 'User Name',\r\n        prompt: 'Please enter your name',\r\n        placeHolder: 'John Doe',\r\n    });\r\n\r\n    // Finish the command.\r\n    // ...\r\n\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Example 2: get two arguments from the user:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "@cmd('my-command', 'My Command Description')\r\npublic async myCommand(): Promise<unknown> {\r\n    \r\n    const arg1 = await g.app.gui.get1Arg({\r\n        title: 'User Name',\r\n        prompt: 'Please enter your name',\r\n        placeHolder: 'John Doe',\r\n    });\r\n\r\n    const arg2 = await g.app.gui.get1Arg({\r\n        title: 'User Age',\r\n        prompt: 'Please enter your age',\r\n        placeHolder: '21',\r\n    });\r\n\r\n    // Finish the command.\r\n    // ...\r\n\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "invoking-commands-from-scripts",
      children: "Invoking commands from scripts"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "You can invoke minibuffer commands by name.  For example:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "result = c.doCommandByName('open-outline');\r\n\r\n// or\r\n\r\nresult = c.executeMinibufferCommand('open-outline');\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "making-operations-undoable",
      children: "Making operations undoable"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Plugins and scripts should call u.beforeX and u.afterX methods to describe the operation that is being performed."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Look at the user's guide ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/cheatsheet#undoing-commands",
        children: "undoing commands"
      }), " section for examples, along with the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "https://github.com/boltex/scripting-samples-leojs",
        children: "LeoJS Scripting Samples Repository"
      }), ", which has examples of making your script operations undoable."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["📌 ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "NOTE"
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "u is shorthand for c.undoer. Most u.beforeX methods return undoData that the client code merely passes to the corresponding u.afterX method. This data contains the 'before' snapshot. The u.afterX methods then create a bead containing both the 'before' and 'after' snapshots."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "u.beforeChangeGroup and u.afterChangeGroup allow multiple calls to u.beforeX and u.afterX methods to be treated as a single undoable entry. See the code for the Replace All, Sort, Promote and Demote commands for examples. The u.beforeChangeGroup and u.afterChangeGroup methods substantially reduce the number of u.beforeX and afterX methods needed."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Plugins and scripts may define their own u.beforeX and afterX methods. Indeed, u.afterX merely needs to set the bunch.undoHelper and bunch.redoHelper ivars to the methods used to undo and redo the operation. See the code for the various u.beforeX and afterX methods for guidance."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "In general, the best way to see how to implement undo is to see how Leo's core calls the u.beforeX and afterX methods."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "modifying-the-body-pane-directly",
      children: "Modifying the body pane directly"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "These are only the most commonly-used methods. For more information, consult Leo's source code."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "const w = c.frame.body.wrapper; // Leo's body pane.\r\n\r\n// Scripts can get or change the context of the body as follows:\r\n\r\nw.appendText(s)                     // Append s to end of body text.\r\nw.delete(i,j=None)                  // Delete characters from i to j.\r\nw.deleteTextSelection()             // Delete the selected text, if any.\r\ns = w.get(i,j=None)                 // Return the text from i to j.\r\ns = w.getAllText                    // Return the entire body text.\r\ni = w.getInsertPoint()              // Return the location of the cursor.\r\ns = w.getSelectedText()             // Return the selected text, if any.\r\n[i,j] = w.getSelectionRange(sort=True)// Return the range of selected text.\r\nw.setAllText(s)                     // Set the entire body text to s.\r\nw.setSelectionRange(i,j,insert=None) // Select the text.\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["📌 ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "NOTE"
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "i and j are zero-based indices into the the text. When j is not specified, it defaults to i. When the sort parameter is in effect, getSelectionRange ensures i <= j."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "recovering-vnodes",
      children: "Recovering vnodes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Positions become invalid whenever the outline changes."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "This script finds a position p2 having the same vnode as an invalid position p:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "if (!c.positionExists(p)) {\r\n    let positionFound = false;\r\n    for (const p2 of c.all_positions()) {\r\n        if (p2.v === p.v) { // found\r\n            c.selectPosition(p2);\r\n            positionFound = true;\r\n            break;\r\n        }\r\n    }\r\n    if (!positionFound) {\r\n        g.es('position no longer exists');\r\n    }\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "recursive-import-script",
      children: "Recursive import script"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The following script imports files from a given directory and all subdirectories:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "c.recursiveImport(\r\n    'path to file or directory', // dir\r\n    '@clean',        // kind like '@file' or '@auto'\r\n    false,       // True: import only one file.\r\n    false,   // True: generate @@clean nodes.\r\n    undefined        // theTypes: Same as ['.py']\r\n);\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "running-code-at-idle-time",
      children: "Running code at idle time"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Scripts and plugins can call g.app.idleTimeManager.add_callback(callback) to cause\r\nthe callback to be called at idle time forever. This should suffice for most purposes:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "function print_hi() {\r\n    g.es('hi');\r\n}\r\n\r\ng.app.idleTimeManager.add_callback(print_hi);\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "For greater control, g.IdleTime is a thin wrapper for the Leo's IdleTime class. The IdleTime class executes a handler with a given delay at idle time. The handler takes a single argument, the IdleTime instance:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "function handler(it: IdleTime): void {\r\n    const delta_t = it.time - it.starting_time;\r\n    g.es_print(it.count, delta_t);\r\n     \r\n    if (it.count >= 5) {\r\n        g.es_print('done');\r\n        it.stop();\r\n    }\r\n}\r\n\r\n// Execute handler every 500 msec. at idle time.\r\nconst it = new g.IdleTime(handler, 500);\r\nif (it) {\r\n    it.start();\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The code creates an instance of the IdleTime class that calls the given handler at idle time, and no more than once every 500 msec.  Here is the output:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["1 0.5100", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "2 1.0300", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "3 1.5400", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "4 2.0500", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "5 2.5610", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "done"]
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Timer instances are completely independent:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "function handler1(it: IdleTime): void {\r\n    const delta_t = it.time - it.starting_time;\r\n    g.es_print(it.count, delta_t);\r\n    \r\n    if (it.count >= 5) {\r\n        g.es_print('done');\r\n        it.stop();\r\n    }\r\n}\r\n\r\nfunction handler2(it: IdleTime): void {\r\n    const delta_t = it.time - it.starting_time;\r\n    g.es_print(it.count, delta_t);\r\n    \r\n    if (it.count >= 10) {\r\n        g.es_print('done');\r\n        it.stop();\r\n    }\r\n}\r\n\r\nconst it1 = new g.IdleTime(handler1, 500);\r\nconst it2 = new g.IdleTime(handler2, 1000);\r\n\r\nif (it1 && it2) {\r\n    it1.start();\r\n    it2.start();\r\n}          \n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Here is the output:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["1 0.5200", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "1 1.0100", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "2 1.0300", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "3 1.5400", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "2 2.0300", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "4 2.0600", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "5 2.5600", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "done", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "3 3.0400", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "4 4.0600", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "5 5.0700", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "6 6.0800", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "7 7.1000", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "8 8.1100", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "9 9.1300", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "10 10.1400", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "done"]
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Recycling timers"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The g.app.idle_timers list retrains references to all timers so they ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "won't"
      }), " be recycled after being stopped.  This allows timers to be restarted safely."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "There is seldom a need to recycle a timer, but if you must, you can call its destroySelf method. This removes the reference to the timer in g.app.idle_timers."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["⚠️ ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "WARNING"
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "Accessing a timer after calling its destroySelf method can lead to a hard crash."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "running-code-in-separate-processes",
      children: "Running code in separate processes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "It is easy for scripts, including @button scripts, plugins, etc., to drive any external processes, including compilers and interpreters, from within Leo."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
          children: "The first section discusses using child_process directly or via Leo helper functions."
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
          children: "The other discusses using g.execute_shell_commands and g.execute_shell_commands_with_options."
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "using-child_processexec",
      children: "Using child_process.exec"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["This first section discusses three ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "easy"
      }), " ways to run code in a separate process by calling child_process.exec either directly or via Leo helper functions."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h4, {
      id: "call-child_processexec-directly",
      children: "Call child_process.exec directly"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Calling child_process.exec is often simple and good. For example, the following executes the 'npm run dev' command in a given directory.  Leo continues, without waiting for the command to return:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "g.chdir(base_dir)\r\n\r\nchild_process.exec('npm run dev', (error, stdout, stderr) => {\r\n    if (error) {\r\n        g.es(`Execution error: ${error}`);\r\n        return;\r\n    }\r\n    g.es(`Output of child_process.exec: ${stdout}`);\r\n    if (stderr) {\r\n        g.es(`Command Error output: ${stderr}`);\r\n    }\r\n});\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The following waits until the command completes:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "g.chdir(base_dir)\r\n\r\nconst child = child_process.exec('python celulas.py');\r\n\r\nawait new Promise( (resolve) => {\r\n    child.on('close', resolve)\r\n})\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h4, {
      id: "call-gexecute_shell_commands",
      children: "Call g.execute_shell_commands"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Use g.execute_shell_commands is a thin wrapper around child_process spawn and exex.  It calls child_process methods once for every command in a list.  It waits for each command to complete, except those starting with '&' Here it is:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "async function execute_shell_commands(commands: string | string[], p_trace?: boolean): Promise<void> {\r\n    if (typeof commands === 'string') {\r\n        commands = [commands];\r\n    }\r\n    for (const command of commands) {\r\n        let wait = !command.startsWith('&');\r\n        if (p_trace) {\r\n            trace(`Trace: ${command}`);\r\n        }\r\n        let cmd = command;\r\n        if (command.startsWith('&')) {\r\n            cmd = command.substring(1).trim();\r\n        }\r\n        if (wait) {\r\n            try {\r\n                await new Promise((resolve, reject) => {\r\n                    const proc = child.exec(cmd, {}, (error, stdout, stderr) => {\r\n                        if (error) {\r\n                            reject(`Command failed: ${stderr}`);\r\n                        } else {\r\n                            resolve(undefined);\r\n                        }\r\n                    });\r\n                });\r\n            } catch (error) {\r\n                console.error(`Command failed with error: ${error}`);\r\n            }\r\n        } else {\r\n            const proc = child.spawn(cmd, { shell: true, stdio: 'inherit' });\r\n            proc.on('error', (error) => {\r\n                console.error(`Command failed with error: ${error}`);\r\n            });\r\n        }\r\n    }\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "For example:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "g.chdir(base_dir);\r\ng.execute_shell_commands(['&npm run dev']);\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h4, {
      id: "call-gexecute_shell_commands_with_options",
      children: "Call g.execute_shell_commands_with_options"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "g.execute_shell_commands_with_options is more flexible.  It allows scripts to get both the starting directory and the commands themselves from Leo's settings. Its signature is:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "/**\r\n * A helper for prototype commands or any other code that\r\n * runs programs in a separate process.\r\n *\r\n * base_dir:           Base directory to use if no config path given.\r\n * commands:           A list of commands, for g.execute_shell_commands.\r\n * commands_setting:   Name of @data setting for commands.\r\n * path_setting:       Name of @string setting for the base directory.\r\n * warning:            A warning to be printed before executing the commands.\r\n */\r\nasync function execute_shell_commands_with_options(\r\n    base_dir: string,\r\n    c: Commands,\r\n    command_setting: string,\r\n    commands: string[],\r\n    path_setting: string,\r\n    trace?: boolean,\r\n    warning?: string,\r\n): Promise<void>\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "For example, put this in myLeoSettings.leo:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "@data"
        }), " my-npm-commands", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "    yarn dev"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "@string"
        }), " my-npm-base = /npmtest"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "And then run:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "g.execute_shell_commands_with_options(\r\n    c = c,\r\n    command_setting = 'my-npm-commands',\r\n    path_setting= 'my-npm-base',\r\n)\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "using-gexecute_shell_commands",
      children: "Using g.execute_shell_commands"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "g.execute_shell_command takes a single argument, which may be either a string or a list of strings. Each string represents one command. g.execute_shell_command executes each command in order.  Commands starting with '&' are executed without waiting. Commands that do not start with '&' finish before running later commands. Examples:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "// Run the qml app in a separate process:\r\ng.execute_shell_commands('qmlscene /test/qml_test.qml');\r\n\r\n// List the contents of a directory:\r\ng.execute_shell_commands([\r\n    'cd ~/test',\r\n    'ls -a',\r\n]);\r\n\r\n// Execute commands that creates files with some content\r\ng.execute_shell_commands([\r\n    'echo blabla > testfile1.txt',\r\n    'echo another text file > testfile2.txt']\r\n);\r\n\r\n// Run a python test in a separate process.\r\ng.execute_shell_commands('python /test/qt_test.py');\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "g.execute_shell_commands_with_options inits an environment and then calls g.execute_shell_commands.  See Leo's source code for details."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "working-with-directives-and-paths",
      children: "Working with directives and paths"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Scripts can easily determine what directives are in effect at a particular position in an outline. c.scanAllDirectives(p) returns a Python dictionary whose keys are directive names and whose values are the value in effect at position p. For example:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "const d = c.scanAllDirectives(p);\r\ng.es(g.objToString(d));\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "In particular, d.get('path') returns the full, absolute path created by all @path directives that are in ancestors of node p. If p is any kind of @file node (including @file, @auto, @clean, etc.), the following script will print the full path to the created file::"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "const myPath = d['path'];\r\nlet name = p.anyAtFileNodeName();\r\nif (name){\r\n    name = g.os_path_finalize_join(myPath, name);\r\n    g.es(name);\r\n}\n"
      })
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ...(0,_mdx_js_react__WEBPACK_IMPORTED_MODULE_1__/* .useMDXComponents */ .R)(),
    ...props.components
  };
  return MDXLayout ? (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(MDXLayout, {
    ...props,
    children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}



/***/ }),

/***/ 8453:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ useMDXComponents),
/* harmony export */   x: () => (/* binding */ MDXProvider)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6540);
/**
 * @typedef {import('mdx/types.js').MDXComponents} MDXComponents
 * @typedef {import('react').Component<{}, {}, unknown>} Component
 * @typedef {import('react').ReactNode} ReactNode
 */

/**
 * @callback MergeComponents
 *   Custom merge function.
 * @param {Readonly<MDXComponents>} currentComponents
 *   Current components from the context.
 * @returns {MDXComponents}
 *   Additional components.
 *
 * @typedef Props
 *   Configuration for `MDXProvider`.
 * @property {ReactNode | null | undefined} [children]
 *   Children (optional).
 * @property {Readonly<MDXComponents> | MergeComponents | null | undefined} [components]
 *   Additional components to use or a function that creates them (optional).
 * @property {boolean | null | undefined} [disableParentContext=false]
 *   Turn off outer component context (default: `false`).
 */



/** @type {Readonly<MDXComponents>} */
const emptyComponents = {}

const MDXContext = react__WEBPACK_IMPORTED_MODULE_0__.createContext(emptyComponents)

/**
 * Get current components from the MDX Context.
 *
 * @param {Readonly<MDXComponents> | MergeComponents | null | undefined} [components]
 *   Additional components to use or a function that creates them (optional).
 * @returns {MDXComponents}
 *   Current components.
 */
function useMDXComponents(components) {
  const contextComponents = react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext)

  // Memoize to avoid unnecessary top-level context changes
  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(
    function () {
      // Custom merge via a function prop
      if (typeof components === 'function') {
        return components(contextComponents)
      }

      return {...contextComponents, ...components}
    },
    [contextComponents, components]
  )
}

/**
 * Provider for MDX context.
 *
 * @param {Readonly<Props>} properties
 *   Properties.
 * @returns {JSX.Element}
 *   Element.
 * @satisfies {Component}
 */
function MDXProvider(properties) {
  /** @type {Readonly<MDXComponents>} */
  let allComponents

  if (properties.disableParentContext) {
    allComponents =
      typeof properties.components === 'function'
        ? properties.components(emptyComponents)
        : properties.components || emptyComponents
  } else {
    allComponents = useMDXComponents(properties.components)
  }

  return react__WEBPACK_IMPORTED_MODULE_0__.createElement(
    MDXContext.Provider,
    {value: allComponents},
    properties.children
  )
}


/***/ })

}]);