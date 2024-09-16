"use strict";
(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[100],{

/***/ 2469:
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
	sidebar_position: 6,
	toc_max_heading_level: 2
};
const contentTitle = 'Useful Tips';
const metadata = {
  "id": "getting-started/tutorial-tips",
  "title": "Useful Tips",
  "description": "The most important tips",
  "source": "@site/docs/getting-started/tutorial-tips.md",
  "sourceDirName": "getting-started",
  "slug": "/getting-started/tutorial-tips",
  "permalink": "/leojs/docs/getting-started/tutorial-tips",
  "draft": false,
  "unlisted": false,
  "tags": [],
  "version": "current",
  "sidebarPosition": 6,
  "frontMatter": {
    "sidebar_position": 6,
    "toc_max_heading_level": 2
  },
  "sidebar": "gettingStartedSidebar",
  "previous": {
    "title": "Writing Leo scripts",
    "permalink": "/leojs/docs/getting-started/tutorial-scripting"
  }
};
const assets = {

};



const toc = [{
  "value": "The most important tips",
  "id": "the-most-important-tips",
  "level": 2
}, {
  "value": "You don&#39;t have to remember command names",
  "id": "you-dont-have-to-remember-command-names",
  "level": 3
}, {
  "value": "Learn to use clones",
  "id": "learn-to-use-clones",
  "level": 3
}, {
  "value": "Learning to use Leo",
  "id": "learning-to-use-leo",
  "level": 2
}, {
  "value": "Move clones to the last top-level node",
  "id": "move-clones-to-the-last-top-level-node",
  "level": 3
}, {
  "value": "Put personal settings myLeoSettings.leo",
  "id": "put-personal-settings-myleosettingsleo",
  "level": 3
}, {
  "value": "Search for settings in leoSettings.leo",
  "id": "search-for-settings-in-leosettingsleo",
  "level": 3
}, {
  "value": "Useful commands and actions",
  "id": "useful-commands-and-actions",
  "level": 2
}, {
  "value": "The find-quick-selected command",
  "id": "the-find-quick-selected-command",
  "level": 3
}, {
  "value": "The parse-body command",
  "id": "the-parse-body-command",
  "level": 3
}, {
  "value": "The sort-siblings command",
  "id": "the-sort-siblings-command",
  "level": 3
}, {
  "value": "Use Alt-N (goto-next-clone) to find &quot;primary&quot; clones",
  "id": "use-alt-n-goto-next-clone-to-find-primary-clones",
  "level": 3
}, {
  "value": "Use cffm to gather outline nodes",
  "id": "use-cffm-to-gather-outline-nodes",
  "level": 3
}, {
  "value": "Use Ctrl-P (Goto-Node) to navigate to any node",
  "id": "use-ctrl-p-goto-node-to-navigate-to-any-node",
  "level": 3
}, {
  "value": "Scripting tips",
  "id": "scripting-tips",
  "level": 2
}, {
  "value": "g.callers() returns a list of callers",
  "id": "gcallers-returns-a-list-of-callers",
  "level": 3
}, {
  "value": "Use @button nodes",
  "id": "use-button-nodes",
  "level": 3
}, {
  "value": "Use cff to gather nodes matching a pattern",
  "id": "use-cff-to-gather-nodes-matching-a-pattern",
  "level": 3
}, {
  "value": "Use g.trace to debug scripts",
  "id": "use-gtrace-to-debug-scripts",
  "level": 3
}, {
  "value": "Use section references sparingly",
  "id": "use-section-references-sparingly",
  "level": 3
}, {
  "value": "Use g.handleUnl to select nodes",
  "id": "use-ghandleunl-to-select-nodes",
  "level": 3
}];
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    em: "em",
    h1: "h1",
    h2: "h2",
    h3: "h3",
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
        id: "useful-tips",
        children: "Useful Tips"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "the-most-important-tips",
      children: "The most important tips"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "you-dont-have-to-remember-command-names",
      children: "You don't have to remember command names"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["To execute a command, type ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "Alt-X"
      }), ", followed by the first few characters of the command name."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["For more details, see the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/getting-started/tutorial-basics#commands",
        children: "commands tutorial"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "learn-to-use-clones",
      children: "Learn to use clones"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Clones are \"live\" copies of the node itself and all its descendants.\r\nSee the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/getting-started/tutorial-pim#clones",
        children: "clones tutorial"
      }), " for more details."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "learning-to-use-leo",
      children: "Learning to use Leo"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "move-clones-to-the-last-top-level-node",
      children: "Move clones to the last top-level node"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Focus your attention on the task at hand by ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/getting-started/tutorial-pim#clones",
        children: "cloning nodes"
      }), ", including\r\n@file nodes, then moving those clones so they are the last top-level nodes\r\nin the outline. This organization allows you to work on nodes scattered\r\nthroughout an outline without altering the structure of @file nodes."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "put-personal-settings-myleosettingsleo",
      children: "Put personal settings myLeoSettings.leo"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Put your ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/users-guide/customizing#using-settings",
        children: "personal settings"
      }), " in myLeoSettings.leo, not leoSettings.leo."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.ul, {
      children: ["\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "The leo-settings command opens leoSettings.leo."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "The my-leo-settings command opens myLeoSettings.leo."
      }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.li, {
        children: "Copy the desired settings nodes from leoSettings.leo to myLeoSettings.leo."
      }), "\n"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "search-for-settings-in-leosettingsleo",
      children: "Search for settings in leoSettings.leo"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "leojsSettings.leojs contains the defaults for all of LeoJS settings, with\r\ndocumentation for each."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "useful-commands-and-actions",
      children: "Useful commands and actions"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "the-find-quick-selected-command",
      children: "The find-quick-selected command"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The find-quick-selected ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "Ctrl-Shift-F"
      }), " command finds all nodes containing the selected text."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "the-parse-body-command",
      children: "The parse-body command"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The parse-body command parses p.b (the body text of the selected node) into separate nodes."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "the-sort-siblings-command",
      children: "The sort-siblings command"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The sort-siblings (Alt-A) command sorts all the child nodes of their parent, or all top-level nodes."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-alt-n-goto-next-clone-to-find-primary-clones",
      children: "Use Alt-N (goto-next-clone) to find \"primary\" clones"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Use Alt-N to cycle through the clones of the present cloned node.\r\nThis command is a fast way of finding the clone whose ancestor is an @<file> node."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-cffm-to-gather-outline-nodes",
      children: "Use cffm to gather outline nodes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The cff command (aka clone-find-flattened-marked) clones all marked nodes\r\nas children of a new node, created as the last top-level node. Use this\r\nto gather nodes throughout an outline."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-ctrl-p-goto-node-to-navigate-to-any-node",
      children: "Use Ctrl-P (Goto-Node) to navigate to any node"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Unlike the original Leo, in LeoJS, ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "Ctrl-P"
      }), " opens an input box with a list of all nodes where you can start to type the headline of the node you want to select, it will restrict the choices as you type."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h2, {
      id: "scripting-tips",
      children: "Scripting tips"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "gcallers-returns-a-list-of-callers",
      children: "g.callers() returns a list of callers"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "g.callers() returns the last n callers (default 4) callers of a function or\r\nmethod. The verbose option shows each caller on a separate line. For\r\nexample:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "g.trace(g.callers());\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-button-nodes",
      children: "Use @button nodes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.a, {
        href: "/leojs/docs/getting-started/tutorial-basics#button-and-command-nodes",
        children: "@button nodes"
      }), " create commands. For example, ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@button my-command"
      }), " creates\r\nthe ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "my-command"
      }), " button and the ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.em, {
        children: "my-command"
      }), " command. Within ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        children: "@button"
      }), "\r\nscripts, c.p is the presently selected outline node.\r\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "@button nodes bring scripts to data"
      }), "."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-cff-to-gather-nodes-matching-a-pattern",
      children: "Use cff to gather nodes matching a pattern"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["The ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "cff command"
      }), " (aka clone-find-flattened) prompts for a search pattern,\r\nthen clones all matching nodes so they are the children of a new last\r\ntop-level node. This command is a great way to study code."]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-gtrace-to-debug-scripts",
      children: "Use g.trace to debug scripts"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "The g.trace function prints all its arguments to the console. g.trace shows\r\npatterns in running code."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-section-references-sparingly",
      children: "Use section references sparingly"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Use section references only when the exact position of a section within a file matters."
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "Here is a common pattern for @file nodes for python files:"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "<<imports>>\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.h3, {
      id: "use-ghandleunl-to-select-nodes",
      children: "Use g.handleUnl to select nodes"
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_components.p, {
      children: ["Leo's status area shows the path from the root node to the selected node. We call such paths ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.strong, {
        children: "UNLs"
      }), " (Uniform Node Locators).  Given a UNL, g.handleUnl(unl, c) will select the referenced node.  For example:"]
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.pre, {
      children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.code, {
        className: "language-js",
        children: "g.handleUnl('unl:gnx://leojsDocs.leojs#felix.20240825232344.32', c);\n"
      })
    }), "\n", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components.p, {
      children: "will select this node in LeojsDocs.leojs."
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