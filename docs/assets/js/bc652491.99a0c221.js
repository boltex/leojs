"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[973],{

/***/ 2488:
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
	sidebar_position: 2
};
const contentTitle = 'Leo in 10 Minutes';
const metadata = {
  "id": "getting-started/tutorial-basics",
  "title": "Leo in 10 Minutes",
  "description": "This page aims to go over the interface, its most important features and terminology, to get you going in a few minutes!",
  "source": "@site/docs/getting-started/tutorial-basics.md",
  "sourceDirName": "getting-started",
  "slug": "/getting-started/tutorial-basics",
  "permalink": "/leojs/docs/getting-started/tutorial-basics",
  "draft": false,
  "unlisted": false,
  "tags": [],
  "version": "current",
  "sidebarPosition": 2,
  "frontMatter": {
    "sidebar_position": 2
  },
  "sidebar": "gettingStartedSidebar",
  "previous": {
    "title": "Installing LeoJS",
    "permalink": "/leojs/docs/getting-started/installing"
  },
  "next": {
    "title": "Using Leo as a PIM",
    "permalink": "/leojs/docs/getting-started/tutorial-pim"
  }
};
const assets = {

};



const toc = [{
  "value": "User Interface",
  "id": "user-interface",
  "level": 2
}, {
  "value": "Find Panel",
  "id": "find-panel",
  "level": 3
}, {
  "value": "Leo Documents Panel",
  "id": "leo-documents-panel",
  "level": 3
}, {
  "value": "Undo Panel",
  "id": "undo-panel",
  "level": 3
}, {
  "value": "Buttons Panel",
  "id": "buttons-panel",
  "level": 3
}, {
  "value": "Commands",
  "id": "commands",
  "level": 2
}, {
  "value": "Outlines and clones",
  "id": "outlines-and-clones",
  "level": 2
}, {
  "value": "Leo directives",
  "id": "leo-directives",
  "level": 2
}, {
  "value": "External files",
  "id": "external-files",
  "level": 2
}, {
  "value": "@file",
  "id": "file",
  "level": 3
}, {
  "value": "Markup",
  "id": "markup",
  "level": 3
}, {
  "value": "@clean",
  "id": "clean",
  "level": 3
}, {
  "value": "@all",
  "id": "all",
  "level": 3
}, {
  "value": "Configuring Leo",
  "id": "configuring-leo",
  "level": 2
}, {
  "value": "Plugins",
  "id": "plugins",
  "level": 2
}, {
  "value": "Scripting basics",
  "id": "scripting-basics",
  "level": 2
}, {
  "value": "Scripting markup",
  "id": "scripting-markup",
  "level": 3
}, {
  "value": "c, g, and p",
  "id": "c-g-and-p",
  "level": 3
}, {
  "value": "Accessing outline data",
  "id": "accessing-outline-data",
  "level": 3
}, {
  "value": "@button and @command nodes",
  "id": "button-and-command-nodes",
  "level": 3
}, {
  "value": "Summary",
  "id": "summary",
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
    header: "header",
    img: "img",
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
        id: "leo-in-10-minutes",
        children: "Leo in 10 Minutes"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "This page aims to go over the interface, its most important features and terminology, to get you going in a few minutes!"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["🚀 For a quick overview, see the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
          href: "https://www.youtube.com/watch?v=j0eo7SlnnSY",
          children: "Introduction to Leo 📺"
        }), " video."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "LeoJS View",
        src: (__webpack_require__(4960)/* ["default"] */ .A) + "",
        width: "1200",
        height: "765"
      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "LeoJS UI panels are located in the LeoJS sidebar view (pictured above), and are also mirrored in the Explorer view"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "user-interface",
      children: "User Interface"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["As stated above the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "LeoJS Outline and UI panels"
      }), " are visible in the standalone LeoJS View, but ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "also in the Explorer View"
      }), ", below the file explorer:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Explorer View",
        src: (__webpack_require__(6815)/* ["default"] */ .A) + "",
        width: "1200",
        height: "691"
      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "The Leo Outline panel shown in the sidebar's Explorer View"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Leo stores all data in nodes. Nodes have headlines (shown in the outline pane) and body text. The body pane shows the body text of the presently selected node, the node whose headline is selected in the outline pane. Headlines have an icon box indicating a node’s status."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "body pane"
      }), " is a text editor which changes to match the selected node of the Leo outline."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Body Pane",
        src: (__webpack_require__(3063)/* ["default"] */ .A) + "",
        width: "1200",
        height: "341"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["💡 ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "TIP"
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "Detached Body Panes"
        }), ", independent of the selected node, can be opened with the 'Open Aside' command from any node.\r\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
          alt: "Body Pane",
          src: (__webpack_require__(8256)/* ["default"] */ .A) + "",
          width: "1200",
          height: "297"
        })]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Below the outline pane are more panels, such as the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Find"
      }), " panel to help navigate the outline, the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Documents"
      }), " panel to manage the currently opened Leo documents, an ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "undo"
      }), " pane for a history of past actions, and a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "buttons"
      }), " panel for easy access to your document's scripts."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Finally, a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Log Window"
      }), " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "https://code.visualstudio.com/api/extension-capabilities/common-capabilities#output-channel",
        children: "output channel"
      }), " is present at the bottom of the window."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Log Window",
        src: (__webpack_require__(6631)/* ["default"] */ .A) + "",
        width: "1200",
        height: "192"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "find-panel",
      children: "Find Panel"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The Find tab shows the status of Leo’s Find/Replace commands. It can be shown and expanded with the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
          children: "Ctrl+F"
        })
      }), " shortcut while the focus is in the Leo outline or body pane."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Find Panel",
        src: (__webpack_require__(2074)/* ["default"] */ .A) + "",
        width: "1200",
        height: "378"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Enter your search pattern directly in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "<find pattern here>"
      }), " field. Press ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
          children: "Enter"
        })
      }), " to find the first match starting from your current position."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Hitting ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
          children: "F3"
        })
      }), " repeatedly will find the subsequent matches. (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
          children: "F2"
        })
      }), " for previous matches)"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Using the Nav tab of the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "find panel"
      }), ", (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
          children: "Ctrl+Shift+F"
        })
      }), " to accesss directly) you can type your search pattern in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Nav"
      }), " field instead to see all results appear below. This will show the headlines as you type."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Nav Tab Panel",
        src: (__webpack_require__(1755)/* ["default"] */ .A) + "",
        width: "1200",
        height: "217"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Press ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
          children: "Enter"
        })
      }), " to freeze the results and show results also found in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "body text of any node"
      }), ". This will add a snowflake icon ❄️ to the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Nav"
      }), " field."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["If you check the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Tag"
      }), " option, the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Nav"
      }), " field is then used to find nodes by their tag 🏷 ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "ua"
      }), " (user attribute)."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "leo-documents-panel",
      children: "Leo Documents Panel"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo documents can be saved in three possible formats: in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "XML"
      }), " as ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: ".leo"
      }), " files, in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "JSON"
      }), " as ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: ".leojs"
      }), " files, and in database form as ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "sqlite"
      }), " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: ".db"
      }), " files."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Nav Tab Panel",
        src: (__webpack_require__(1624)/* ["default"] */ .A) + "",
        width: "1200",
        height: "136"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["This panel shows the currently opened Leo Documents in LeoJS. Select which one is shown by clicking on it, or cycle with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "Ctrl+Tab"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "undo-panel",
      children: "Undo Panel"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "There are undo and redo icons above the Leo outline and above the undo pane itself. You can also right-click on an undo step to directly switch to that specific state."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Nav Tab Panel",
        src: (__webpack_require__(2051)/* ["default"] */ .A) + "",
        width: "1200",
        height: "179"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["📌 ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "NOTE"
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", "The undo functionality is a multi-tiered system that separates structural outline changes from text changes within the body pane."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "buttons-panel",
      children: "Buttons Panel"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Scripts can be assigned to reusable commands or buttons. Those are displayed in this panel."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Nav Tab Panel",
        src: (__webpack_require__(2698)/* ["default"] */ .A) + "",
        width: "1200",
        height: "165"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "commands",
      children: "Commands"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo has hundreds of commands, described in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/commands",
        children: "Leo's Command Reference"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["A curated set of common commands are accessible through the VSCode UI — toolbar buttons, icon menus, and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/commands#key-reference",
        children: "key bindings"
      }), ". Those commands are discoverable via the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette",
        children: "VSCode Command Palette"
      }), ". (accessible through ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "F1"
      }), " or ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "Ctrl+Shift+P"
      }), ")"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["With ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "Alt+X"
      }), ", the complete set of commands is discoverable in its entirety through Leo's own command palette: ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/commands#executing-commands-from-the-minibuffer",
        children: "Leo's minibuffer"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Leo&#39;s Minibuffer",
        src: (__webpack_require__(7284)/* ["default"] */ .A) + "",
        width: "1200",
        height: "291"
      }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "The minibuffer showing all available commands"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.blockquote, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
        children: ["💡 ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "TIP"
        }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.br, {}), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
          children: "There is no need to remember the exact names of Leo’s commands."
        }), " Instead, you only need to remember a few common command prefixes."]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "outlines-and-clones",
      children: "Outlines and clones"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo is a ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/commands#outline-commands",
        children: "full-featured outliner"
      }), ", with commands to insert, delete, move, hoist, promote and demote nodes."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Clones"
      }), " are a unique feature of Leo. Any outline node may be cloned. Cloned nodes are actually the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "same"
      }), " node, but they appear in different places in the outline. Changes to any clone affect all other clones of that node, ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "including their descendants"
      }), ". For example, suppose the A` nodes are clones of each other:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Clones change before",
        src: (__webpack_require__(7742)/* ["default"] */ .A) + "",
        width: "1200",
        height: "264"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Moving C right gives this outline:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Clones change after",
        src: (__webpack_require__(3585)/* ["default"] */ .A) + "",
        width: "1200",
        height: "264"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Clones allow you to create multiple views of data within a single outline. For example, Leo's ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "clone-find commands"
      }), " create clones of all found nodes, moving the newly-created clones so they are all children of an ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "organizer node"
      }), " describing the search. The organizer node is a new view of the outline's data, one focused on the found nodes!"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "leo-directives",
      children: "Leo directives"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "directives"
      }), " control Leo's operations. Directives start with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@"
      }), " in the leftmost column of body text. Directives ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "apply to descendants"
      }), " unless overridden in descendant nodes."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@color"
      }), ", ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@nocolor"
      }), ", and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@nocolor-node"
      }), " directives control syntax coloring. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Note"
      }), ": Nodes containing multiple color directives do ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "not"
      }), " affect the coloring of descendant nodes."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@language"
      }), " directive tells which language is in effect:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@lаnguage python\r\n@lаnguage c\r\n@lаnguage rest # restructured text\r\n@lаnguage plain # plain text: no syntax coloring.\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@pagewidth"
      }), " directive sets the page width used by the reformat-paragraph command. The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@tabwidth"
      }), " directive controls tabbing. Negative tab widths (recommended for Python) convert tabs to spaces:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@pаgewidth 100\r\n@tаbwidth -4\r\n@tаbwidth 8\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@wrap"
      }), " and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@nowrap"
      }), " enable or disable line wrapping in the body pane:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@nowrаp\r\n@wrаp\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@first"
      }), " directive ensures that lines appear at the very start of an external file. See the next section. Multiple @first directives are allowed. These directives must be the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "very first"
      }), " lines of body text:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@firѕt # -*- coding: utf-8 -*-\r\n@firѕt #! /usr/bin/env python\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo has many other directives, described in the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/directives",
        children: "directives reference page"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "external-files",
      children: "External files"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo outlines can refer to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "external files"
      }), ", files on your file system. Leo quickly loads the files when opening Leo outlines. The following sections discuss only the basics.  See ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/directives",
        children: "Leo's Reference Guide"
      }), " for full details."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "file",
      children: "@file"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["An ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@file node"
      }), " is a node whose headline starts with ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@file"
      }), " followed by a path to an external file:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "At-File",
        src: (__webpack_require__(7601)/* ["default"] */ .A) + "",
        width: "1200",
        height: "79"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The @file node and its descendants represent an external file. Leo updates @file nodes when you change external files outside of Leo. When saving an outline, Leo writes all changed @file trees to their external files."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "markup",
      children: "Markup"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo's ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "markup"
      }), " tells Leo how to create external files from @file trees. Markup may appear in any body text, and ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "must"
      }), " appear in the body of the @file node itself."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["There are two kinds of markup: ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "section references"
      }), " (", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "<< this is my section >>"
      }), ") and the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@others"
      }), " directive. Section references refer to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "named nodes"
      }), ", nodes whose ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "headlines"
      }), " look like a section reference. @others refers to all ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "other"
      }), " (unnamed) nodes. Here is the body text of a typical ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@file"
      }), " node for a python file:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-python",
        children: "@firѕt # -*- coding: utf-8 -*-\r\n'''whatever.py'''\r\n<< imports >>\r\n@οthers\r\n# That's all, folks\r\n@lаnguage javascript\r\n@tаbwidth -4\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "A child node must define the << imports >> node. Other children will typically define classes, methods, functions, and data."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "When writing this file, Leo writes the first two lines:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-python",
        children: "# -*- coding: utf-8 -*-\r\n'''whatever.py'''\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["followed by the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "body text"
      }), " of the << imports >> node, followed by the body text of all ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "other"
      }), " nodes, in outline order, followed by the comment # That's all, folks."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "clean",
      children: "@clean"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["When writing ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "file trees"
      }), ", Leo writes ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "sentinel comments"
      }), " into external files. These comments represent outline structure. When writing an @file tree to a .leo file, Leo writes only the root @file node. To avoid sentinels, use ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@clean"
      }), " instead of @file:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "At-Clean",
        src: (__webpack_require__(8077)/* ["default"] */ .A) + "",
        width: "1200",
        height: "79"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "There is a small cost to @clean: Leo saves the entire @clean tree in the .leo file."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "all",
      children: "@all"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@all"
      }), " directive tells Leo to write the nodes of an ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@file tree"
      }), " to the external file, ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "ignoring"
      }), " all markup. As a result, Leo writes nodes to the file in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "outline order"
      }), ", the order in which they appear in the outline when all nodes are expanded."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "configuring-leo",
      children: "Configuring Leo"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo uses outlines for just about ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "everything"
      }), ", including configuring Leo:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
            children: "leojsSettings.leojs"
          }), " contains the LeoJS default ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
            children: "global settings"
          }), "."]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
          children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
            children: "~/myLeoSettings.leo"
          }), " contains your ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
            children: "personal settings"
          }), ". It will be created  automatically if it doesn't exist when using the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
            children: "Open myLeoSettings"
          }), " command. Settings in myLeoSettings.leo override (or add to) the default settings in leojsSettings.leojs."]
        }), "\n"]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
          children: ["Any other .leo file may also contain ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
            children: "local settings"
          }), ". Local settings apply only to that file and override all other settings."]
        }), "\n"]
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Settings nodes"
      }), " specify settings. These nodes ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "must"
      }), " be descendants of an ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@settings"
      }), " node. Moving a settings node out from the @settings tree disables the setting. Headlines start with @ followed by a type, and possibly a value.  Here are some examples, with body text shown indented from headlines:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.img, {
        alt: "Settings",
        src: (__webpack_require__(5882)/* ["default"] */ .A) + "",
        width: "1200",
        height: "233"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["For more information, see Leo's ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/customizing",
        children: "configuration guide"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "plugins",
      children: "Plugins"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The LeoJS internal API is accessible when running scripts, but it is also exposed to other VSCode extensions, thus providing a way for software creators ro write ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "plugins"
      }), " for LeoJS."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["See ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/advanced-topics/writing-plugins",
        children: "Writing Plugins"
      }), " for more information about the LeoJS plugins architecture."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "scripting-basics",
      children: "Scripting basics"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Non-programmers: feel free to skip this part."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "scripting-markup",
      children: "Scripting markup"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo's markup applies to scripts as well as external files. Leo's execute-script command ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "composes"
      }), " the script from the selected node, using Leo's markup. For example, this body text defines the top-level part of a script:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "/**\r\n * My script\r\n */\r\n<< imports >>\r\nclass Controller {\r\n    // Child nodes define the methods of this class.\r\n    @οthers\r\n}\r\nnew Controller(c).run(); // c *is* defined.\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo recognizes section references only if they appear ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "alone"
      }), " on a line.  Therefore the following are ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "not"
      }), " section references:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "// << reference 1 >>\r\n/* << reference 2 >> */\r\na = b << c >> 2;\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "c-g-and-p",
      children: "c, g, and p"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The execute-script command pre-defines three names: c, g, and p. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "c"
      }), " is the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "#accessing-outline-data",
        children: "commander"
      }), " of the outline in which the script executes. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "g"
      }), " is the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "leo.core.leoGlobals"
      }), " module, containing dozens of useful functions and classes.  ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "p"
      }), " is the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/getting-started/tutorial-scripting#positions-and-vnodes",
        children: "position"
      }), " of the presently selected node."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "accessing-outline-data",
      children: "Accessing outline data"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "Commander class"
      }), " defines both a scripting API and a DOM (Document Object Module) giving ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "complete"
      }), " access to all data in an outline. For example:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "/**\r\n * Print all headlines of the outline, properly indented,\r\n * with the number of characters in each node's body text.\r\n */\r\n\r\n// c.all_positions() is a generator yielding all positions, in outline order.\r\nfor (const p of c.all_positions()) {\r\n    const length = p.b.length; // p.b is p's body text.\r\n    const spaces = ' '.repeat(p.level()); // p.level() is p's indentation level.\r\n    const headline = p.h; // p.h is p's headline.\r\n\r\n    g.es(`${String(length).padStart(3, ' ')} ${spaces} ${headline}`);\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["To run this script, put it in the body text of any node and press ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "Ctrl-B"
      }), ", execute-script."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["For more information, see Leo's ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/getting-started/tutorial-scripting",
        children: "scripting tutorial"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "button-and-command-nodes",
      children: "@button and @command nodes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@command nodes"
      }), " define a command. Running the command runs a script that can be applied to any outline node. That is, p is bound to the presently selected node, ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "not"
      }), " the @button node. ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@button nodes"
      }), " work the same way, and also create a button in the icon area. Pressing that button runs the command. For example, this node defines the print-tree command:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["First, set a node's headline to: ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@command print-tree"
      })]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "And its body text to:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-ts",
        children: "/**\r\n * Print all headlines of the selected subtree, properly indented,\r\n * with the number of characters in each node's body text.\r\n */\r\n \r\n// p.self_and_subtree() is a generator yielding p and\r\n// all positions in p's subtree, in outline order.\r\nfor (const p of p.self_and_subtree()) {\r\n    const length = p.b.length; // p.b is p's body text.\r\n    const spaces = ' '.repeat(p.level()); // p.level() is p's indentation level.\r\n    const headline = p.h; // p.h is p's headline.\r\n\r\n    g.es(`${String(length).padStart(3, ' ')} ${spaces} ${headline}`);\r\n}\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "summary",
      children: "Summary"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Leo is a full-featured outliner with the following special features:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "Directives control how Leo works."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "@file and @clean nodes create external files."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "myLeoSettings.leo specifies your personal settings."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "Plugins extend Leo. @enabled-plugins settings nodes enable plugins."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "For programmers:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "Leo has an easy-to-use scripting API, giving full access to all data in the outline."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.li, {
        children: ["@button and @command nodes define scripts that can be applied to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
          children: "other"
        }), " nodes."]
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "Alt-1 enables autocompletion."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo has hundreds of commands, described in ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/commands",
        children: "Leo's Command Reference"
      }), ". Please feel free to ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "https://groups.google.com/g/leo-editor",
        children: "ask for help"
      }), " in Leo's public forum at any time."]
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

/***/ 8077:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAABPCAYAAAD7qjwQAAAdRElEQVR42u3df3CT94Hn8XfTisvwlLFCIm8XLUXQlXJXhUMerxUOwSK3i8kg0prMBFJsZk0anKamCc66kIBTSJeEQNgCBZJgsuCZYCh4JnEncaYRu7FSIobIoajHKdfIk6CWVS6HskTUeXwEJfT+kMGyMRCMAcV8XjP84UffX8/3K5jxh+/zfb6CiIhcN5xO1180CyIiMlR0dMS/olkQEbk+3KApEBERERERERGRfKYAS0RERERERERE8poCLBERERERERERyWsKsEREREREREREJK8pwBIRERERERERkbymAEtERERERERERPKaAiwREREREREREclrCrBERERERERERCSvKcASEREREREREZG8pgBLRERERERERETymgIsERERERERERHJawqwREREREREREQkrynAEhGRARpO8cRihmsiBlkFq3bt5Pk6n8aZZ/e666kKfT1FRERErpGvaQpERGQgbgnU8sO7x2B6XmD5c/vouo7u3TohwOyAnyKnHeuNPdcznSmS8QivbGsifFzfkcFS+dROAmOAdIRND6wn3G+pClbtCuD4Yys/eKRJkyYiIiIyxCjAEhGRAfmodR2/Gr2CeRPn8ThckRBr+YpHrsjY33vvCDte2D2Ami4CS2upHF+AeTRKuLmZyFGz+zMDR4mf0pIACzf6KXt5PWt+FcPUV2XwWL3M+YmH8Mao5kJERETkOqMAS0REBqiL3z63AriyIdYboTcHtb1x3xo7wJouKp9aRmBUmsi2B1i398Q5JWKHI7RuM3BXLWPJ9xezamQDDz4T1ldlUJwglSrANmk+1b95iIYOzYiIiIjI9UQBloiIXIarE2KFBjHEGmiA5Xu4lsCYLqJblrIudKF9VSaxxqWs5Gnqp1dSezjMun36ply+j4k0v4vvx15Kf1xNqLaBuCZFRERE5LqhAEtERC5TNsQyP13Gj6bOo/7TLlZuP3jNzsQyPN9jZPnj51w/mXibVOOCgTU6uopZJQWk9q9h9ZnwyhlgyY/K8YwyAEi/GyIx0o/zT5u5b22YeGMTh0oWUzStHPa15DRWgO/eWuZMHItthCV7KXOC+G82sXxn7PxjcAaoXTCTInsBlhuydZIHX6FhQ2tOkGPg/v4C5t9RhN3a03bi9e2sbIz0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NbJ9S/AiAV2K8LJmhj8yi9Lp7u7bSRF/rYk1jZFz6+5tJVbuxjvSJN6uw9tFRERk6PmKpkBE5PrhdLr+MnitDefv/+F/8Pt/+3dOXKHx+gc5uMoVCr05gAkMUL+oAvfIDOl3I4Qj7Rw6eiZKsOGc5GWyx0Nm/1wefUHfNxkYX91WFhanaP1B9461L8RD7ebFeImwuma9zr+S60ZHR1y/z4iIXCe0A0tERAaoi9/+279f0R4GFDJd0d+UWllZ8yaeGXOY+d0iyu7xEcjZ9JPpTJGMB2k7oG+HXGXTArhH6vB2ERERGboUYImIiFySE0RfbSD6qmZC8oXBnCkujEycvTq8XURERIYoBVgiIiIiX0ZTaqgvMUnf7MM3DpKv7dTh7SIiIjJkKcASERER+TLKWLCXlOE+bZLcv53ljXHNiYiIiAxZOvRQROQ6MriHuIuIiFxbOsRdROT6cYOmQERERERERERE8pkCLBERERERERERyWsKsEREREREREREJK8pwBIRERERERERkbymAEtERERERERERPKaAiwREREREREREclrCrBERERERERERCSvKcASEREREREREZG8pgBLRERERERERETymgIsERERERERERHJawqwREREREREREQkrynAEhERERERERGRvKYAS0REJK9UsGrXTp6v82kqRERERES6fU1TICIicmmsEwLMDvgpctqx3thzPdOZIhmP8Mq2JsLHNU/nMGbz+LPl2P/QyH1PBq9+fRERERH50lKAJSIieWv5ikeuSLvvvXeEHS/sHkBNF4GltVSOL8A8GiXc3EzkqNn9mYGjxE9pSYCFG/2UvbyeNb+KYWoZz7LPKcFlOUHkteA1qf/FlbHwX2bh+tMOHtwQvkqz46ayvhr/sAj3/azpSzJmERERkatHAZaIiOS1N0JvDmp74741doA1XVQ+tYzAqDSRbQ+wbu+Jc0rEDkdo3WbgrlrGku8vZtXIBh58RmFClofZxXb4IMieg9ei/qWwYR9VwPD/czXnx4r9mzaM41+mMYuIiIhcPQqwREQk74UGMcQaaIDle7iWwJguoluWsi50oX1VJrHGpazkaeqnV1J7OMy6fVpDpgVwj8wQf7GZ5LWoLyIiIiJfagqwRERkSDE832Nk+ePnXD+ZeJtU44KBNTq6ilklBaT2r2H1mfDKGWDJj8rxjDIASL8b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");

/***/ }),

/***/ 7601:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/png;base64,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Xaysi2tORERERK6SNj0UEbmFDO0m7iIiIjeWNnEXEbl13KYpEBERERERERGRXKYAS0REREREREREcpoCLBERERERERERyWkKsEREREREREREJKcpwBIRERERERERkZymAEtERERERERERHKaAiwREREREREREclpCrBERERERERERCSnKcASEREREREREZGcpgBLRERERERERERymgIsERERERERERHJaQqwREREREREREQkp31JUyAiIvJZMvCWr2DeFAfW2yDdUcOCNwv56ZM+rIlWlq2oJwkwdy0N02xEX5jP+v2aNRERERG5tSnAEhERGSDruACzAn7ynXasd5w/njmZIhmP8PrOesIn+i9rzPwhC6c6IBWj/TdpDIBhFiy5OFBjFs9uL8H++zq+tzb42ZcXEREREemhAEtERHLWylVPXZd63333KLtfaRxESReB5VWUjc3DPBYl3NxM5JjZc87AUeinqDDAwi1+il+rYcPPYph9aphR4MJCgtZla9h97mSEBTm4yso+uxCXpYvIvuANKX/1iln4P2bg+uNuHt8c/oxmx01ZdQX+2yN875n6z0mfRURERD6/FGCJiEhOezP01pDWN+ar9w2ypIuy51YQGJkmsnMBm9q6LroidiRC604Dd/kKln57CeuG1/L4C73DCTfWO4GTaY6auT7zHmYV2OH9IE2HbkT5gbBhH5nHsP/7Wc6PFftXbBgnPk99FhEREfn8UoAlIiI5LzSEIdZgAyzfk1UERncTfWk5m0KXS59MYnXLWc3zVE8to+pImE3nVldZMe74nEz6lADu4Rnie5uze3J91uVFRERERHpRgCUiIjcVw/Mthpc8e9HxU4m3SdXNH1ylo8qZUZhH6sAG1p8Nr5wBln6/BM9IA4D0OyESw/04/7iN720ME6+r53DhEvKnlMD+FnyLd7CwwOip0MPChj0sxOzZpL2UdQ0BbIeyZS/LGaBq/nTy7XlYbgMyXSQPvU7t5lbiQzeLzJ7kwjDjhJvNISp/foyLDzhZOrcIhzW785f5foSmNTUET1xYh/vb85n3YD72nus4kyGdPMzrO2po7cweKntuD4HRPUUKKmloqIRz85o97HpoERXTzteTSSc5/MYONr12fsaMwnKWzPVx391Gdl7PmKQizTy++eLbHy94L+8M0NAQACDxxhwarZtZOsFG6pereHzH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");

/***/ }),

/***/ 3063:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/body-pane-montage-6d69282b5d9c27780d955e2056f38828.png");

/***/ }),

/***/ 2698:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/buttons-panel-montage-4d12ec2d4a37d1ef7af8680b83dc23c5.png");

/***/ }),

/***/ 3585:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAAEICAYAAABPgA1wAAAgAElEQVR42u3df3SV9YHn8Y9IUHP9kYFQWRM7sQwRy5CmcrTajvXXEbFpO+pU0al6ZNu1P6ztaF1/tF213a1Fxk7VSm0dO3JGEOhqdXaWFeOxtbVWq6uTCUUUhpEKdKkkFCo3VoO4f2AyIEFBAzy5eb3O6TneH89z7/0+X9N73n6f5+4RAKDfnXzyya8ZBRh87r///j2MAgD0v6GGAAD637//+3MGAQAA+skQQwAAAABAkQlYAAAAABSagAUAAABAoQlYAAAAABSagAUAAABAoQlYAAAAABSagAUAAABAoQlYAAAAABSagAUAQL8YN25cpkyZkg984Mg3fd4HPnBkzjvvvNTX17+j16uvr895552XiRNPMvgAUOGGGgIAqCzf+ta1aWhoSFdXV2688aa0t7dv8fgpp0zK2Wefnaqqqq22Xb26I9OmTcuKFSu22t/mnnzyqVx//fVbbV9fX5/LLrssI0fWbrWvc875ZFpaWrbaZlv7eqv33Nfnu/TSSzNhwuHp7u7O7Nmzc9998/vcx7x585Kkz/ezua6ursyadWdOPfXUPj9Tj80/27x58zJz5qwtXq+v99PU1JQvfemLqa6uzrJly3LllV95y2PzxS9+sTDzbNy4cZkwYUKefPLJLFy4cJvPO+2005Ik99xzj385AYC3TcACAPr0ZjFlwoTDc9NNN/UZc/rSVwTbXtvatrq6OldeeUVvMCqyqqqqnHLKR7Jgwa+3a7wGqoULF75pzAIAeLsELADYxYYMGZKxY8fmmWeeycaNG7d7m8MPPzxPPfXUdm+zPba1+qmpqSmf+MQn+lw91LPKaeTI2lx44edz5ZVfedPXOOWUSamrq0uSPldljRr1n7a57aWXXtobr3pWKfW8v57VSxMnTkxnZ+cWq5u2x8yZs3rDV1+roXq809PceowcWZuzzjrrLVebvdWxAQAYjAQsANjFzj77rJxwwgn52c9+npkzZ75lkBoyZEg++9nPpLm5Oa2trbnrrrt3+nucOHFiqqurkyStra1bxKHrr7++d1VUXV1dTjll0nbHo3J5/RYrkN5s5VRTU1MOO2xskk3ha/r07/U+1t7enrvuuqt3hdiHP/zhHQ5Yu0NT0/gdGq/+P64nZfjw4Zk///6sXbs2SVJTU5NJk07OmjVr0tr6wBa3k+Td7353kuTVVzfm8ccfz8KFC3PaaadlxIjhSZKjjz4qRx99VBYsWJD168u9pxUmyZFHHpk999x0ydVPf/pTWb9+febPv7/P99bzuvvuu2+S9D63530mm66dNX78+N7bS5cu9QcFAAYJF3EHgF3srrvuTnt7e4499sM555xzMmTItv/vuCdeHX744Wlra8uPf7zzryNUX1/fGy26urrS3r5gq+f0nCZWVVWVceP+fLv33dDQkG9969rtem5T0/jeiPb8889vderdggW/ztq165Ik73rXu9LU1FTYY7548ZJ0dXX1xraBoGcO3HbbD3PXXXfnpZe6Mn78n6empib33HNPHn30sbzySnceffSx3HbbD/OrXz2+1Ry5/fbb09m5Jp2da3LbbT/MnDlztwhSm8+5j3/843n55Vdy220/zG23/TAvv/xKJk06OTU1NUk2xbf3vndc7+vdddfdOfDAAzNsWJU/KgAwCAhYALCLvfzyy/n+93/wlhFr83j11FNP5fvf/0G/nj6YbLqW1ezZd/b+79JLL83w4cNTKm0KR+VyV+9KnM11dnamu7t7u17jvvvmbxHBGhoaMnv2nbnpppve9PS8zU8tXLXq/231+IoVK1Iurx8Qx/zFF1/MT3/6097Pf845n3xbx2ZXWr9+fR5//Ikkydq1a/Pcc89ln32qe08H7U/vfe9hSZInnnii974nnngiw4btlUMPbUx9fX1GjfpPefrp/7jG1tq1a7Ngwa/z6qsb/VEBgEFAwAKA3eDll1/Od797c/71X/uOWEOGDMmUKefv1Hi1K11//fX5x3/8xy2i18iRtbn22m/mlFMmDYpjPnPmrCxbtixJcvzxx+eggw4q9Ptds2bNFqul1q8vJ0n23bfUr69TU1OT4cOH58UXX9xild369evzyisv54ADDkhd3UHZc889e99Dj3Xr1uXVV1/1BwUABgHXwAKA3WTjxo25+eab84UvfCHHHrvptLKZM2cmSaZMOT9HH330To9XfV0ofPNT8Uql6gwfPnyr0/dGjBjR568Tvpn77puf++6bn/r6+lx22WUZObJ2u3+dr68LvdfX16dU2neL+/paqVUks2fP6b1Y/Ec+8pEdPjaVbMSI4fn0pz+11f09KwBfffXVrFu3zh8OABikBCwA2I16ItaFF34+xx774eyxx6b7jz766Dz66KO5/fYZu3zlVXt7e1544YU0NDSkuro6TU3j097evsVzxo0blyTp7u7OwoW/7r1/y9MP1/cZpVasWJFp06b1RqxtRbKFC3+dpqbxqaqqyrvf/e7U19dv8ZxN12M6IEnywgsvpL29PU1Nmy7wXVVVlREjRmyxv57o1t3dnc7Ozt1yvNvb2/PTn/40LS0tGTmy1r8Am3n++efT2vpAn4994ANHGiAAGOScQggAu9nGjRszffr30tbWlmOPPTbHHnvsbotXPX7+85/3nu43ceLELU7z6/kFwiRZuXJl1q9fn2OO+Yve5/ZceL2zc9PKmVNOmZSvf/3rW+x/8/i0rets3Xff/KxcuTLJptMNL7zw872PnXLKpN5fIOzu7s7Pf/7zJEl7+4J0dXUl2XSaXs9qsqamphx//PFJkrVr12XBgl/vtuO9+amEu9q6desybNhevb/0lyT77rtvhg3ba7eNx9q1a7NmzZoMHz6894Ltb7R+fTl77rln6uq2PO3ygAMOyJ577umPCAAMAlZgAUAB9ESsnlB0333z33G8qq6uzpVXXrHFfU8++dQWK6Z6LhTeo6urKzfeeFPuu29+RowYkZaWllRVVeW8887Leeedt8W+Vq/uyPTp38v48X+es88+O5///Oe3eGzOnDm9tw85pGGL19nc44//apunD06f/r3elVo9F39/o9bW1tx33/wkW65w6uvzv9XrvZWRI2vzt387bYv75s2bt8P72fxUwm3p69h86lOffkdzYuXK3+bQQ8fmve89rHcMjjjiiLf1S349p/O91TWxyuX1vXGqr18gTJKnn16UE044Iccff3zuuWfTL23W1NTk+OOPzxNPPJGFCxemsbExhx46NitX/jYrVqxIfX19JkyYkD339N9jAWAwELAAoCA2btyYefP+T2Hez8yZs/LQQz/rDUibmzdvXmbOnJVk02qqza1e3ZFp06b1BpKVK3+b7u7ura6Z1RPL3nh64uZWrFiRL37xiznnnE+mpaXlTV9n8/fd2dnZu0JrR15vV2lvb8+iRc9kwoTDd+nrrlixIs8++0zGjx/fe72pZ555JnvtNext7WvVqv+X8ePHZ/z48VmwYMFWF1lP/iNOfeITf5X169dn/vz7+9zXT37yk5xwwglbXAfr+eef7z2+99xzT0477bRMmnRykuTVVzfm6acX5tBD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");

/***/ }),

/***/ 7742:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:image/png;base64,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");

/***/ }),

/***/ 1624:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/document-panel-montage-6959a9296bd9cf0dde2d8b3f61ad7a5a.png");

/***/ }),

/***/ 6815:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/explorer-docs-montage-0a8a63c483ef1c54b1798e3e978e4f69.png");

/***/ }),

/***/ 2074:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/find-panel-montage-7ceec060b555a3cf985d05ab06df0f5b.png");

/***/ }),

/***/ 4960:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/hero-docs-montage-71dc15d7c54d75e28c289d365cdec044.png");

/***/ }),

/***/ 6631:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/log-pane-f06706aaac877bf493aa40f890fe53ec.png");

/***/ }),

/***/ 7284:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/minibuffer-list-0e93d5e7c139eb27ffdf9774b593aabc.png");

/***/ }),

/***/ 1755:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/nav-panel-results-montage-1deb957b3fb457e9bb16f3075b7ea43f.png");

/***/ }),

/***/ 8256:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/outline-context-montage-04540b2bc2a3419ecb40839bbaf6ebb4.png");

/***/ }),

/***/ 5882:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/settings-sample-2b2753a73df3c8e84023bccd576d9a7b.png");

/***/ }),

/***/ 2051:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "assets/images/undo-panel-context-montage-2eefb09ea6112ba9704e07128ab81e4c.png");

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