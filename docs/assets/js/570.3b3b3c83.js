(self["webpackChunkdocs"] = self["webpackChunkdocs"] || []).push([[570],{

/***/ 7293:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Admonition)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/admonitionUtils.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Workaround because it's difficult in MDX v1 to provide a MDX title as props
// See https://github.com/facebook/docusaurus/pull/7152#issuecomment-1145779682
function extractMDXAdmonitionTitle(children){const items=react.Children.toArray(children);const mdxAdmonitionTitleWrapper=items.find(item=>/*#__PURE__*/react.isValidElement(item)&&item.type==='mdxAdmonitionTitle');const rest=items.filter(item=>item!==mdxAdmonitionTitleWrapper);const mdxAdmonitionTitle=mdxAdmonitionTitleWrapper?.props.children;return{mdxAdmonitionTitle,rest:rest.length>0?/*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:rest}):null};}function processAdmonitionProps(props){const{mdxAdmonitionTitle,rest}=extractMDXAdmonitionTitle(props.children);const title=props.title??mdxAdmonitionTitle;return{...props,// Do not return "title: undefined" prop
// this might create unwanted props overrides when merging props
// For example: {...default,...props}
...(title&&{title}),children:rest};}
// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(4164);
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(1312);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(7559);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Layout/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"admonition":"admonition_xJq3","admonitionHeading":"admonitionHeading_Gvgb","admonitionIcon":"admonitionIcon_Rf37","admonitionContent":"admonitionContent_BuS1"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Layout/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionContainer(_ref){let{type,className,children}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)(ThemeClassNames/* ThemeClassNames */.G.common.admonition,ThemeClassNames/* ThemeClassNames */.G.common.admonitionType(type),styles_module.admonition,className),children:children});}function AdmonitionHeading(_ref2){let{icon,title}=_ref2;return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:styles_module.admonitionHeading,children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:styles_module.admonitionIcon,children:icon}),title]});}function AdmonitionContent(_ref3){let{children}=_ref3;return children?/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:styles_module.admonitionContent,children:children}):null;}function AdmonitionLayout(props){const{type,icon,title,children,className}=props;return/*#__PURE__*/(0,jsx_runtime.jsxs)(AdmonitionContainer,{type:type,className:className,children:[title||icon?/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionHeading,{title:title,icon:icon}):null,/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionContent,{children:children})]});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Note.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconNote(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 14 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Note.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const infimaClassName='alert alert--secondary';const defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconNote,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.note",description:"The default label used for the Note admonition (:::note)",children:"note"})};function AdmonitionTypeNote(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...defaultProps,...props,className:(0,clsx/* default */.A)(infimaClassName,props.className),children:props.children});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Tip.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconTip(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 12 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Tip.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Tip_infimaClassName='alert alert--success';const Tip_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconTip,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.tip",description:"The default label used for the Tip admonition (:::tip)",children:"tip"})};function AdmonitionTypeTip(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Tip_defaultProps,...props,className:(0,clsx/* default */.A)(Tip_infimaClassName,props.className),children:props.children});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Info.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconInfo(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 14 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Info.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Info_infimaClassName='alert alert--info';const Info_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconInfo,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.info",description:"The default label used for the Info admonition (:::info)",children:"info"})};function AdmonitionTypeInfo(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Info_defaultProps,...props,className:(0,clsx/* default */.A)(Info_infimaClassName,props.className),children:props.children});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Warning.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconCaution(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 16 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Warning.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Warning_infimaClassName='alert alert--warning';const Warning_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconCaution,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.warning",description:"The default label used for the Warning admonition (:::warning)",children:"warning"})};function AdmonitionTypeWarning(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Warning_defaultProps,...props,className:(0,clsx/* default */.A)(Warning_infimaClassName,props.className),children:props.children});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Icon/Danger.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function AdmonitionIconDanger(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 12 16",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Danger.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Danger_infimaClassName='alert alert--danger';const Danger_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconDanger,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.danger",description:"The default label used for the Danger admonition (:::danger)",children:"danger"})};function AdmonitionTypeDanger(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Danger_defaultProps,...props,className:(0,clsx/* default */.A)(Danger_infimaClassName,props.className),children:props.children});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Type/Caution.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const Caution_infimaClassName='alert alert--warning';const Caution_defaultProps={icon:/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionIconCaution,{}),title:/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.admonition.caution",description:"The default label used for the Caution admonition (:::caution)",children:"caution"})};// TODO remove before v4: Caution replaced by Warning
// see https://github.com/facebook/docusaurus/issues/7558
function AdmonitionTypeCaution(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionLayout,{...Caution_defaultProps,...props,className:(0,clsx/* default */.A)(Caution_infimaClassName,props.className),children:props.children});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/Types.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const admonitionTypes={note:AdmonitionTypeNote,tip:AdmonitionTypeTip,info:AdmonitionTypeInfo,warning:AdmonitionTypeWarning,danger:AdmonitionTypeDanger};// Undocumented legacy admonition type aliases
// Provide hardcoded/untranslated retrocompatible label
// See also https://github.com/facebook/docusaurus/issues/7767
const admonitionAliases={secondary:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeNote,{title:"secondary",...props}),important:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeInfo,{title:"important",...props}),success:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeTip,{title:"success",...props}),caution:AdmonitionTypeCaution};/* harmony default export */ const Types = ({...admonitionTypes,...admonitionAliases});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function getAdmonitionTypeComponent(type){const component=Types[type];if(component){return component;}console.warn(`No admonition component found for admonition type "${type}". Using Info as fallback.`);return Types.info;}function Admonition(unprocessedProps){const props=processAdmonitionProps(unprocessedProps);const AdmonitionTypeComponent=getAdmonitionTypeComponent(props.type);return/*#__PURE__*/(0,jsx_runtime.jsx)(AdmonitionTypeComponent,{...props});}

/***/ }),

/***/ 6896:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ ContentVisibility)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(4164);
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(1312);
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Head.js
var Head = __webpack_require__(5260);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/translations/contentVisibilityTranslations.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function UnlistedBannerTitle(){return/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.contentVisibility.unlistedBanner.title",description:"The unlisted content banner title",children:"Unlisted page"});}function UnlistedBannerMessage(){return/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.contentVisibility.unlistedBanner.message",description:"The unlisted content banner message",children:"This page is unlisted. Search engines will not index it, and only users having a direct link can access it."});}// TODO Docusaurus v4 breaking change (since it's v3 public theme-common API :/)
//  Move this to theme/ContentVisibility/Unlisted
function UnlistedMetadata(){return/*#__PURE__*/(0,jsx_runtime.jsx)(Head/* default */.A,{children:/*#__PURE__*/(0,jsx_runtime.jsx)("meta",{name:"robots",content:"noindex, nofollow"})});}function DraftBannerTitle(){return/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.contentVisibility.draftBanner.title",description:"The draft content banner title",children:"Draft page"});}function DraftBannerMessage(){return/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.contentVisibility.draftBanner.message",description:"The draft content banner message",children:"This page is a draft. It will only be visible in dev and be excluded from the production build."});}
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(7559);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/index.js + 15 modules
var Admonition = __webpack_require__(7293);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/ContentVisibility/Draft/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function Draft(_ref){let{className}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)(Admonition/* default */.A,{type:"caution",title:/*#__PURE__*/(0,jsx_runtime.jsx)(DraftBannerTitle,{}),className:(0,clsx/* default */.A)(className,ThemeClassNames/* ThemeClassNames */.G.common.draftBanner),children:/*#__PURE__*/(0,jsx_runtime.jsx)(DraftBannerMessage,{})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/ContentVisibility/Unlisted/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function UnlistedBanner(_ref){let{className}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)(Admonition/* default */.A,{type:"caution",title:/*#__PURE__*/(0,jsx_runtime.jsx)(UnlistedBannerTitle,{}),className:(0,clsx/* default */.A)(className,ThemeClassNames/* ThemeClassNames */.G.common.unlistedBanner),children:/*#__PURE__*/(0,jsx_runtime.jsx)(UnlistedBannerMessage,{})});}function Unlisted(props){return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(UnlistedMetadata,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(UnlistedBanner,{...props})]});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/ContentVisibility/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function ContentVisibility(_ref){let{metadata}=_ref;const{unlisted,frontMatter}=metadata;// Reading draft/unlisted status from frontMatter is useful to display
// the banners in dev mode (in dev, metadata.unlisted is always false)
// See https://github.com/facebook/docusaurus/issues/8285
return/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(unlisted||frontMatter.unlisted)&&/*#__PURE__*/(0,jsx_runtime.jsx)(Unlisted,{}),frontMatter.draft&&/*#__PURE__*/(0,jsx_runtime.jsx)(Draft,{})]});}

/***/ }),

/***/ 2153:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ EditMetaRow)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(4164);
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(1312);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(7559);
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Link.js
var Link = __webpack_require__(8774);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Icon/Edit/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"iconEdit":"iconEdit_Z9Sw"});
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Icon/Edit/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function IconEdit(_ref){let{className,...restProps}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,clsx/* default */.A)(styles_module.iconEdit,className),"aria-hidden":"true",...restProps,children:/*#__PURE__*/(0,jsx_runtime.jsx)("g",{children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/EditThisPage/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function EditThisPage(_ref){let{editUrl}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsxs)(Link/* default */.A,{to:editUrl,className:ThemeClassNames/* ThemeClassNames */.G.common.editThisPage,children:[/*#__PURE__*/(0,jsx_runtime.jsx)(IconEdit,{}),/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.common.editThisPage",description:"The link label to edit the current page",children:"Edit this page"})]});}
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/useDocusaurusContext.js
var useDocusaurusContext = __webpack_require__(4586);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/IntlUtils.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function useCalendar(){const{i18n:{currentLocale,localeConfigs}}=(0,useDocusaurusContext/* default */.A)();return localeConfigs[currentLocale].calendar;}function useDateTimeFormat(options){if(options===void 0){options={};}const{i18n:{currentLocale}}=(0,useDocusaurusContext/* default */.A)();const calendar=useCalendar();return new Intl.DateTimeFormat(currentLocale,{calendar,...options});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/LastUpdated/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function LastUpdatedAtDate(_ref){let{lastUpdatedAt}=_ref;const atDate=new Date(lastUpdatedAt);const dateTimeFormat=useDateTimeFormat({day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});const formattedLastUpdatedAt=dateTimeFormat.format(atDate);return/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:/*#__PURE__*/(0,jsx_runtime.jsx)("b",{children:/*#__PURE__*/(0,jsx_runtime.jsx)("time",{dateTime:atDate.toISOString(),itemProp:"dateModified",children:formattedLastUpdatedAt})})},children:' on {date}'});}function LastUpdatedByUser(_ref2){let{lastUpdatedBy}=_ref2;return/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:/*#__PURE__*/(0,jsx_runtime.jsx)("b",{children:lastUpdatedBy})},children:' by {user}'});}function LastUpdated(_ref3){let{lastUpdatedAt,lastUpdatedBy}=_ref3;return/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{className:ThemeClassNames/* ThemeClassNames */.G.common.lastUpdated,children:[/*#__PURE__*/(0,jsx_runtime.jsx)(Translate/* default */.A,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:lastUpdatedAt?/*#__PURE__*/(0,jsx_runtime.jsx)(LastUpdatedAtDate,{lastUpdatedAt:lastUpdatedAt}):'',byUser:lastUpdatedBy?/*#__PURE__*/(0,jsx_runtime.jsx)(LastUpdatedByUser,{lastUpdatedBy:lastUpdatedBy}):''},children:'Last updated{atDate}{byUser}'}), false&&/*#__PURE__*/0]});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/EditMetaRow/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const EditMetaRow_styles_module = ({"lastUpdated":"lastUpdated_JAkA"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/EditMetaRow/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function EditMetaRow(_ref){let{className,editUrl,lastUpdatedAt,lastUpdatedBy}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:(0,clsx/* default */.A)('row',className),children:[/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:"col",children:editUrl&&/*#__PURE__*/(0,jsx_runtime.jsx)(EditThisPage,{editUrl:editUrl})}),/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)('col',EditMetaRow_styles_module.lastUpdated),children:(lastUpdatedAt||lastUpdatedBy)&&/*#__PURE__*/(0,jsx_runtime.jsx)(LastUpdated,{lastUpdatedAt:lastUpdatedAt,lastUpdatedBy:lastUpdatedBy})})]});}

/***/ }),

/***/ 5243:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ MDXContent)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/@mdx-js/react/lib/index.js
var lib = __webpack_require__(8453);
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Head.js
var Head = __webpack_require__(5260);
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/useIsBrowser.js
var useIsBrowser = __webpack_require__(2303);
// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(4164);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/contexts/colorMode.js
var contexts_colorMode = __webpack_require__(5293);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/useThemeConfig.js
var useThemeConfig = __webpack_require__(6342);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/hooks/usePrismTheme.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *//**
 * Returns a color-mode-dependent Prism theme: whatever the user specified in
 * the config. Falls back to `palenight`.
 */function usePrismTheme(){const{prism}=(0,useThemeConfig/* useThemeConfig */.p)();const{colorMode}=(0,contexts_colorMode/* useColorMode */.G)();const lightModeTheme=prism.theme;const darkModeTheme=prism.darkTheme||lightModeTheme;const prismTheme=colorMode==='dark'?darkModeTheme:lightModeTheme;return prismTheme;}
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/ThemeClassNames.js
var ThemeClassNames = __webpack_require__(7559);
// EXTERNAL MODULE: ./node_modules/parse-numeric-range/index.js
var parse_numeric_range = __webpack_require__(8426);
var parse_numeric_range_default = /*#__PURE__*/__webpack_require__.n(parse_numeric_range);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/codeBlockUtils.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const codeBlockTitleRegex=/title=(?<quote>["'])(?<title>.*?)\1/;const metastringLinesRangeRegex=/\{(?<range>[\d,-]+)\}/;// Supported types of highlight comments
const popularCommentPatterns={js:{start:'\\/\\/',end:''},jsBlock:{start:'\\/\\*',end:'\\*\\/'},jsx:{start:'\\{\\s*\\/\\*',end:'\\*\\/\\s*\\}'},bash:{start:'#',end:''},html:{start:'<!--',end:'-->'}};const commentPatterns={...popularCommentPatterns,// shallow copy is sufficient
// minor comment styles
lua:{start:'--',end:''},wasm:{start:'\\;\\;',end:''},tex:{start:'%',end:''},vb:{start:"['‘’]",end:''},vbnet:{start:"(?:_\\s*)?['‘’]",end:''},// Visual Studio 2019 or later
rem:{start:'[Rr][Ee][Mm]\\b',end:''},f90:{start:'!',end:''},// Free format only
ml:{start:'\\(\\*',end:'\\*\\)'},cobol:{start:'\\*>',end:''}// Free format only
};const popularCommentTypes=Object.keys(popularCommentPatterns);function getCommentPattern(languages,magicCommentDirectives){// To be more reliable, the opening and closing comment must match
const commentPattern=languages.map(lang=>{const{start,end}=commentPatterns[lang];return`(?:${start}\\s*(${magicCommentDirectives.flatMap(d=>[d.line,d.block?.start,d.block?.end].filter(Boolean)).join('|')})\\s*${end})`;}).join('|');// White space is allowed, but otherwise it should be on it's own line
return new RegExp(`^\\s*(?:${commentPattern})\\s*$`);}/**
 * Select comment styles based on language
 */function getAllMagicCommentDirectiveStyles(lang,magicCommentDirectives){switch(lang){case'js':case'javascript':case'ts':case'typescript':return getCommentPattern(['js','jsBlock'],magicCommentDirectives);case'jsx':case'tsx':return getCommentPattern(['js','jsBlock','jsx'],magicCommentDirectives);case'html':return getCommentPattern(['js','jsBlock','html'],magicCommentDirectives);case'python':case'py':case'bash':return getCommentPattern(['bash'],magicCommentDirectives);case'markdown':case'md':// Text uses HTML, front matter uses bash
return getCommentPattern(['html','jsx','bash'],magicCommentDirectives);case'tex':case'latex':case'matlab':return getCommentPattern(['tex'],magicCommentDirectives);case'lua':case'haskell':case'sql':return getCommentPattern(['lua'],magicCommentDirectives);case'wasm':return getCommentPattern(['wasm'],magicCommentDirectives);case'vb':case'vba':case'visual-basic':return getCommentPattern(['vb','rem'],magicCommentDirectives);case'vbnet':return getCommentPattern(['vbnet','rem'],magicCommentDirectives);case'batch':return getCommentPattern(['rem'],magicCommentDirectives);case'basic':// https://github.com/PrismJS/prism/blob/master/components/prism-basic.js#L3
return getCommentPattern(['rem','f90'],magicCommentDirectives);case'fsharp':return getCommentPattern(['js','ml'],magicCommentDirectives);case'ocaml':case'sml':return getCommentPattern(['ml'],magicCommentDirectives);case'fortran':return getCommentPattern(['f90'],magicCommentDirectives);case'cobol':return getCommentPattern(['cobol'],magicCommentDirectives);default:// All popular comment types
return getCommentPattern(popularCommentTypes,magicCommentDirectives);}}function parseCodeBlockTitle(metastring){return metastring?.match(codeBlockTitleRegex)?.groups.title??'';}function containsLineNumbers(metastring){return Boolean(metastring?.includes('showLineNumbers'));}/**
 * Gets the language name from the class name (set by MDX).
 * e.g. `"language-javascript"` => `"javascript"`.
 * Returns undefined if there is no language class name.
 */function parseLanguage(className){const languageClassName=className.split(' ').find(str=>str.startsWith('language-'));return languageClassName?.replace(/language-/,'');}/**
 * Parses the code content, strips away any magic comments, and returns the
 * clean content and the highlighted lines marked by the comments or metastring.
 *
 * If the metastring contains a range, the `content` will be returned as-is
 * without any parsing. The returned `lineClassNames` will be a map from that
 * number range to the first magic comment config entry (which _should_ be for
 * line highlight directives.)
 *
 * @param content The raw code with magic comments. Trailing newline will be
 * trimmed upfront.
 * @param options Options for parsing behavior.
 */function parseLines(content,options){let code=content.replace(/\n$/,'');const{language,magicComments,metastring}=options;// Highlighted lines specified in props: don't parse the content
if(metastring&&metastringLinesRangeRegex.test(metastring)){const linesRange=metastring.match(metastringLinesRangeRegex).groups.range;if(magicComments.length===0){throw new Error(`A highlight range has been given in code block's metastring (\`\`\` ${metastring}), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.`);}const metastringRangeClassName=magicComments[0].className;const lines=parse_numeric_range_default()(linesRange).filter(n=>n>0).map(n=>[n-1,[metastringRangeClassName]]);return{lineClassNames:Object.fromEntries(lines),code};}if(language===undefined){return{lineClassNames:{},code};}const directiveRegex=getAllMagicCommentDirectiveStyles(language,magicComments);// Go through line by line
const lines=code.split('\n');const blocks=Object.fromEntries(magicComments.map(d=>[d.className,{start:0,range:''}]));const lineToClassName=Object.fromEntries(magicComments.filter(d=>d.line).map(_ref=>{let{className,line}=_ref;return[line,className];}));const blockStartToClassName=Object.fromEntries(magicComments.filter(d=>d.block).map(_ref2=>{let{className,block}=_ref2;return[block.start,className];}));const blockEndToClassName=Object.fromEntries(magicComments.filter(d=>d.block).map(_ref3=>{let{className,block}=_ref3;return[block.end,className];}));for(let lineNumber=0;lineNumber<lines.length;){const line=lines[lineNumber];const match=line.match(directiveRegex);if(!match){// Lines without directives are unchanged
lineNumber+=1;continue;}const directive=match.slice(1).find(item=>item!==undefined);if(lineToClassName[directive]){blocks[lineToClassName[directive]].range+=`${lineNumber},`;}else if(blockStartToClassName[directive]){blocks[blockStartToClassName[directive]].start=lineNumber;}else if(blockEndToClassName[directive]){blocks[blockEndToClassName[directive]].range+=`${blocks[blockEndToClassName[directive]].start}-${lineNumber-1},`;}lines.splice(lineNumber,1);}code=lines.join('\n');const lineClassNames={};Object.entries(blocks).forEach(_ref4=>{let[className,{range}]=_ref4;parse_numeric_range_default()(range).forEach(l=>{lineClassNames[l]??=[];lineClassNames[l].push(className);});});return{lineClassNames,code};}function getPrismCssVariables(prismTheme){const mapping={color:'--prism-color',backgroundColor:'--prism-background-color'};const properties={};Object.entries(prismTheme.plain).forEach(_ref5=>{let[key,value]=_ref5;const varName=mapping[key];if(varName&&typeof value==='string'){properties[varName]=value;}});return properties;}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/Container/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"codeBlockContainer":"codeBlockContainer_Ckt0"});
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/Container/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function CodeBlockContainer(_ref){let{as:As,...props}=_ref;const prismTheme=usePrismTheme();const prismCssVariables=getPrismCssVariables(prismTheme);return/*#__PURE__*/(0,jsx_runtime.jsx)(As// Polymorphic components are hard to type, without `oneOf` generics
,{...props,style:prismCssVariables,className:(0,clsx/* default */.A)(props.className,styles_module.codeBlockContainer,ThemeClassNames/* ThemeClassNames */.G.common.codeBlock)});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/Content/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Content_styles_module = ({"codeBlockContent":"codeBlockContent_biex","codeBlockTitle":"codeBlockTitle_Ktv7","codeBlock":"codeBlock_bY9V","codeBlockStandalone":"codeBlockStandalone_MEMb","codeBlockLines":"codeBlockLines_e6Vv","codeBlockLinesWithNumbering":"codeBlockLinesWithNumbering_o6Pm","buttonGroup":"buttonGroup__atx"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/Content/Element.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// <pre> tags in markdown map to CodeBlocks. They may contain JSX children. When
// the children is not a simple string, we just return a styled block without
// actually highlighting.
function CodeBlockJSX(_ref){let{children,className}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)(CodeBlockContainer,{as:"pre",tabIndex:0,className:(0,clsx/* default */.A)(Content_styles_module.codeBlockStandalone,'thin-scrollbar',className),children:/*#__PURE__*/(0,jsx_runtime.jsx)("code",{className:Content_styles_module.codeBlockLines,children:children})});}
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/reactUtils.js
var reactUtils = __webpack_require__(9532);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/hooks/useMutationObserver.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const DefaultOptions={attributes:true,characterData:true,childList:true,subtree:true};function useMutationObserver(target,callback,options){if(options===void 0){options=DefaultOptions;}const stableCallback=(0,reactUtils/* useEvent */._q)(callback);// MutationObserver options are not nested much
// so this should be to memo options in 99%
// TODO handle options.attributeFilter array
const stableOptions=(0,reactUtils/* useShallowMemoObject */.Be)(options);(0,react.useEffect)(()=>{const observer=new MutationObserver(stableCallback);if(target){observer.observe(target,stableOptions);}return()=>observer.disconnect();},[target,stableCallback,stableOptions]);}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/hooks/useCodeWordWrap.js
// Callback fires when the "hidden" attribute of a tabpanel changes
// See https://github.com/facebook/docusaurus/pull/7485
function useTabBecameVisibleCallback(codeBlockRef,callback){const[hiddenTabElement,setHiddenTabElement]=(0,react.useState)();const updateHiddenTabElement=(0,react.useCallback)(()=>{// No need to observe non-hidden tabs
// + we want to force a re-render when a tab becomes visible
setHiddenTabElement(codeBlockRef.current?.closest('[role=tabpanel][hidden]'));},[codeBlockRef,setHiddenTabElement]);(0,react.useEffect)(()=>{updateHiddenTabElement();},[updateHiddenTabElement]);useMutationObserver(hiddenTabElement,mutations=>{mutations.forEach(mutation=>{if(mutation.type==='attributes'&&mutation.attributeName==='hidden'){callback();updateHiddenTabElement();}});},{attributes:true,characterData:false,childList:false,subtree:false});}function useCodeWordWrap(){const[isEnabled,setIsEnabled]=(0,react.useState)(false);const[isCodeScrollable,setIsCodeScrollable]=(0,react.useState)(false);const codeBlockRef=(0,react.useRef)(null);const toggle=(0,react.useCallback)(()=>{const codeElement=codeBlockRef.current.querySelector('code');if(isEnabled){codeElement.removeAttribute('style');}else{codeElement.style.whiteSpace='pre-wrap';// When code wrap is enabled, we want to avoid a scrollbar in any case
// Ensure that very very long words/strings/tokens still wrap
codeElement.style.overflowWrap='anywhere';}setIsEnabled(value=>!value);},[codeBlockRef,isEnabled]);const updateCodeIsScrollable=(0,react.useCallback)(()=>{const{scrollWidth,clientWidth}=codeBlockRef.current;const isScrollable=scrollWidth>clientWidth||codeBlockRef.current.querySelector('code').hasAttribute('style');setIsCodeScrollable(isScrollable);},[codeBlockRef]);useTabBecameVisibleCallback(codeBlockRef,updateCodeIsScrollable);(0,react.useEffect)(()=>{updateCodeIsScrollable();},[isEnabled,updateCodeIsScrollable]);(0,react.useEffect)(()=>{window.addEventListener('resize',updateCodeIsScrollable,{passive:true});return()=>{window.removeEventListener('resize',updateCodeIsScrollable);};},[updateCodeIsScrollable]);return{codeBlockRef,isEnabled,isCodeScrollable,toggle};}
// EXTERNAL MODULE: ./node_modules/prism-react-renderer/dist/index.mjs
var dist = __webpack_require__(1765);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/Line/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Line_styles_module = ({"codeLine":"codeLine_lJS_","codeLineNumber":"codeLineNumber_Tfdd","codeLineContent":"codeLineContent_feaV"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/Line/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function CodeBlockLine(_ref){let{line,classNames,showLineNumbers,getLineProps,getTokenProps}=_ref;if(line.length===1&&line[0].content==='\n'){line[0].content='';}const lineProps=getLineProps({line,className:(0,clsx/* default */.A)(classNames,showLineNumbers&&Line_styles_module.codeLine)});const lineTokens=line.map((token,key)=>/*#__PURE__*/(0,jsx_runtime.jsx)("span",{...getTokenProps({token})},key));return/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{...lineProps,children:[showLineNumbers?/*#__PURE__*/(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:Line_styles_module.codeLineNumber}),/*#__PURE__*/(0,jsx_runtime.jsx)("span",{className:Line_styles_module.codeLineContent,children:lineTokens})]}):lineTokens,/*#__PURE__*/(0,jsx_runtime.jsx)("br",{})]});}
;// CONCATENATED MODULE: ./node_modules/copy-text-to-clipboard/index.js
function copyTextToClipboard(text, {target = document.body} = {}) {
	if (typeof text !== 'string') {
		throw new TypeError(`Expected parameter \`text\` to be a \`string\`, got \`${typeof text}\`.`);
	}

	const element = document.createElement('textarea');
	const previouslyFocusedElement = document.activeElement;

	element.value = text;

	// Prevent keyboard from showing on mobile
	element.setAttribute('readonly', '');

	element.style.contain = 'strict';
	element.style.position = 'absolute';
	element.style.left = '-9999px';
	element.style.fontSize = '12pt'; // Prevent zooming on iOS

	const selection = document.getSelection();
	const originalRange = selection.rangeCount > 0 && selection.getRangeAt(0);

	target.append(element);
	element.select();

	// Explicit selection workaround for iOS
	element.selectionStart = 0;
	element.selectionEnd = text.length;

	let isSuccess = false;
	try {
		isSuccess = document.execCommand('copy');
	} catch {}

	element.remove();

	if (originalRange) {
		selection.removeAllRanges();
		selection.addRange(originalRange);
	}

	// Get the focus back on the previously focused element, if any
	if (previouslyFocusedElement) {
		previouslyFocusedElement.focus();
	}

	return isSuccess;
}

// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Translate.js + 1 modules
var Translate = __webpack_require__(1312);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Icon/Copy/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function IconCopy(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 24 24",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fill:"currentColor",d:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Icon/Success/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function IconSuccess(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 24 24",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fill:"currentColor",d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/CopyButton/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const CopyButton_styles_module = ({"copyButtonCopied":"copyButtonCopied_obH4","copyButtonIcons":"copyButtonIcons_eSgA","copyButtonIcon":"copyButtonIcon_y97N","copyButtonSuccessIcon":"copyButtonSuccessIcon_LjdS"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/CopyButton/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function CopyButton(_ref){let{code,className}=_ref;const[isCopied,setIsCopied]=(0,react.useState)(false);const copyTimeout=(0,react.useRef)(undefined);const handleCopyCode=(0,react.useCallback)(()=>{copyTextToClipboard(code);setIsCopied(true);copyTimeout.current=window.setTimeout(()=>{setIsCopied(false);},1000);},[code]);(0,react.useEffect)(()=>()=>window.clearTimeout(copyTimeout.current),[]);return/*#__PURE__*/(0,jsx_runtime.jsx)("button",{type:"button","aria-label":isCopied?(0,Translate/* translate */.T)({id:'theme.CodeBlock.copied',message:'Copied',description:'The copied button label on code blocks'}):(0,Translate/* translate */.T)({id:'theme.CodeBlock.copyButtonAriaLabel',message:'Copy code to clipboard',description:'The ARIA label for copy code blocks button'}),title:(0,Translate/* translate */.T)({id:'theme.CodeBlock.copy',message:'Copy',description:'The copy button label on code blocks'}),className:(0,clsx/* default */.A)('clean-btn',className,CopyButton_styles_module.copyButton,isCopied&&CopyButton_styles_module.copyButtonCopied),onClick:handleCopyCode,children:/*#__PURE__*/(0,jsx_runtime.jsxs)("span",{className:CopyButton_styles_module.copyButtonIcons,"aria-hidden":"true",children:[/*#__PURE__*/(0,jsx_runtime.jsx)(IconCopy,{className:CopyButton_styles_module.copyButtonIcon}),/*#__PURE__*/(0,jsx_runtime.jsx)(IconSuccess,{className:CopyButton_styles_module.copyButtonSuccessIcon})]})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Icon/WordWrap/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function IconWordWrap(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("svg",{viewBox:"0 0 24 24",...props,children:/*#__PURE__*/(0,jsx_runtime.jsx)("path",{fill:"currentColor",d:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/WordWrapButton/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const WordWrapButton_styles_module = ({"wordWrapButtonIcon":"wordWrapButtonIcon_Bwma","wordWrapButtonEnabled":"wordWrapButtonEnabled_EoeP"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/WordWrapButton/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function WordWrapButton(_ref){let{className,onClick,isEnabled}=_ref;const title=(0,Translate/* translate */.T)({id:'theme.CodeBlock.wordWrapToggle',message:'Toggle word wrap',description:'The title attribute for toggle word wrapping button of code block lines'});return/*#__PURE__*/(0,jsx_runtime.jsx)("button",{type:"button",onClick:onClick,className:(0,clsx/* default */.A)('clean-btn',className,isEnabled&&WordWrapButton_styles_module.wordWrapButtonEnabled),"aria-label":title,title:title,children:/*#__PURE__*/(0,jsx_runtime.jsx)(IconWordWrap,{className:WordWrapButton_styles_module.wordWrapButtonIcon,"aria-hidden":"true"})});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/Content/String.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Prism languages are always lowercase
// We want to fail-safe and allow both "php" and "PHP"
// See https://github.com/facebook/docusaurus/issues/9012
function normalizeLanguage(language){return language?.toLowerCase();}function CodeBlockString(_ref){let{children,className:blockClassName='',metastring,title:titleProp,showLineNumbers:showLineNumbersProp,language:languageProp}=_ref;const{prism:{defaultLanguage,magicComments}}=(0,useThemeConfig/* useThemeConfig */.p)();const language=normalizeLanguage(languageProp??parseLanguage(blockClassName)??defaultLanguage);const prismTheme=usePrismTheme();const wordWrap=useCodeWordWrap();// We still parse the metastring in case we want to support more syntax in the
// future. Note that MDX doesn't strip quotes when parsing metastring:
// "title=\"xyz\"" => title: "\"xyz\""
const title=parseCodeBlockTitle(metastring)||titleProp;const{lineClassNames,code}=parseLines(children,{metastring,language,magicComments});const showLineNumbers=showLineNumbersProp??containsLineNumbers(metastring);return/*#__PURE__*/(0,jsx_runtime.jsxs)(CodeBlockContainer,{as:"div",className:(0,clsx/* default */.A)(blockClassName,language&&!blockClassName.includes(`language-${language}`)&&`language-${language}`),children:[title&&/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:Content_styles_module.codeBlockTitle,children:title}),/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:Content_styles_module.codeBlockContent,children:[/*#__PURE__*/(0,jsx_runtime.jsx)(dist/* Highlight */.f4,{theme:prismTheme,code:code,language:language??'text',children:_ref2=>{let{className,style,tokens,getLineProps,getTokenProps}=_ref2;return/*#__PURE__*/(0,jsx_runtime.jsx)("pre",{/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */tabIndex:0,ref:wordWrap.codeBlockRef,className:(0,clsx/* default */.A)(className,Content_styles_module.codeBlock,'thin-scrollbar'),style:style,children:/*#__PURE__*/(0,jsx_runtime.jsx)("code",{className:(0,clsx/* default */.A)(Content_styles_module.codeBlockLines,showLineNumbers&&Content_styles_module.codeBlockLinesWithNumbering),children:tokens.map((line,i)=>/*#__PURE__*/(0,jsx_runtime.jsx)(CodeBlockLine,{line:line,getLineProps:getLineProps,getTokenProps:getTokenProps,classNames:lineClassNames[i],showLineNumbers:showLineNumbers},i))})});}}),/*#__PURE__*/(0,jsx_runtime.jsxs)("div",{className:Content_styles_module.buttonGroup,children:[(wordWrap.isEnabled||wordWrap.isCodeScrollable)&&/*#__PURE__*/(0,jsx_runtime.jsx)(WordWrapButton,{className:Content_styles_module.codeButton,onClick:()=>wordWrap.toggle(),isEnabled:wordWrap.isEnabled}),/*#__PURE__*/(0,jsx_runtime.jsx)(CopyButton,{className:Content_styles_module.codeButton,code:code})]})]})]});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeBlock/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *//**
 * Best attempt to make the children a plain string so it is copyable. If there
 * are react elements, we will not be able to copy the content, and it will
 * return `children` as-is; otherwise, it concatenates the string children
 * together.
 */function maybeStringifyChildren(children){if(react.Children.toArray(children).some(el=>/*#__PURE__*/(0,react.isValidElement)(el))){return children;}// The children is now guaranteed to be one/more plain strings
return Array.isArray(children)?children.join(''):children;}function CodeBlock(_ref){let{children:rawChildren,...props}=_ref;// The Prism theme on SSR is always the default theme but the site theme can
// be in a different mode. React hydration doesn't update DOM styles that come
// from SSR. Hence force a re-render after mounting to apply the current
// relevant styles.
const isBrowser=(0,useIsBrowser/* default */.A)();const children=maybeStringifyChildren(rawChildren);const CodeBlockComp=typeof children==='string'?CodeBlockString:CodeBlockJSX;return/*#__PURE__*/(0,jsx_runtime.jsx)(CodeBlockComp,{...props,children:children},String(isBrowser));}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/CodeInline/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Simple component used to render inline code blocks
// its purpose is to be swizzled and customized
// MDX 1 used to have a inlineCode comp, see https://mdxjs.com/migrating/v2/
function CodeInline(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("code",{...props});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Code.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function shouldBeInline(props){return(// empty code blocks have no props.children,
// see https://github.com/facebook/docusaurus/pull/9704
typeof props.children!=='undefined'&&react.Children.toArray(props.children).every(el=>typeof el==='string'&&!el.includes('\n')));}function MDXCode(props){return shouldBeInline(props)?/*#__PURE__*/(0,jsx_runtime.jsx)(CodeInline,{...props}):/*#__PURE__*/(0,jsx_runtime.jsx)(CodeBlock,{...props});}
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Link.js
var Link = __webpack_require__(8774);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/A.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function MDXA(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(Link/* default */.A,{...props});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Pre.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function MDXPre(props){// With MDX 2, this element is only used for fenced code blocks
// It always receives a MDXComponents/Code as children
return/*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:props.children});}
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/useBrokenLinks.js + 1 modules
var useBrokenLinks = __webpack_require__(3427);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/components/Collapsible/index.js
var Collapsible = __webpack_require__(1422);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/components/Details/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Details_styles_module = ({"details":"details_lb9f","isBrowser":"isBrowser_bmU9","collapsibleContent":"collapsibleContent_i85q"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/components/Details/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function isInSummary(node){if(!node){return false;}return node.tagName==='SUMMARY'||isInSummary(node.parentElement);}function hasParent(node,parent){if(!node){return false;}return node===parent||hasParent(node.parentElement,parent);}/**
 * A mostly un-styled `<details>` element with smooth collapsing. Provides some
 * very lightweight styles, but you should bring your UI.
 */function Details(_ref){let{summary,children,...props}=_ref;(0,useBrokenLinks/* default */.A)().collectAnchor(props.id);const isBrowser=(0,useIsBrowser/* default */.A)();const detailsRef=(0,react.useRef)(null);const{collapsed,setCollapsed}=(0,Collapsible/* useCollapsible */.u)({initialState:!props.open});// Use a separate state for the actual details prop, because it must be set
// only after animation completes, otherwise close animations won't work
const[open,setOpen]=(0,react.useState)(props.open);const summaryElement=/*#__PURE__*/react.isValidElement(summary)?summary:/*#__PURE__*/(0,jsx_runtime.jsx)("summary",{children:summary??'Details'});return/*#__PURE__*/ (// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
(0,jsx_runtime.jsxs)("details",{...props,ref:detailsRef,open:open,"data-collapsed":collapsed,className:(0,clsx/* default */.A)(Details_styles_module.details,isBrowser&&Details_styles_module.isBrowser,props.className),onMouseDown:e=>{const target=e.target;// Prevent a double-click to highlight summary text
if(isInSummary(target)&&e.detail>1){e.preventDefault();}},onClick:e=>{e.stopPropagation();// For isolation of multiple nested details/summary
const target=e.target;const shouldToggle=isInSummary(target)&&hasParent(target,detailsRef.current);if(!shouldToggle){return;}e.preventDefault();if(collapsed){setCollapsed(false);setOpen(true);}else{setCollapsed(true);// Don't do this, it breaks close animation!
// setOpen(false);
}},children:[summaryElement,/*#__PURE__*/(0,jsx_runtime.jsx)(Collapsible/* Collapsible */.N,{lazy:false// Content might matter for SEO in this case
,collapsed:collapsed,disableSSRStyle:true// Allows component to work fine even with JS disabled!
,onCollapseTransitionEnd:newCollapsed=>{setCollapsed(newCollapsed);setOpen(!newCollapsed);},children:/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:Details_styles_module.collapsibleContent,children:children})})]}));}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Details/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const theme_Details_styles_module = ({"details":"details_b_Ee"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Details/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Should we have a custom details/summary comp in Infima instead of reusing
// alert classes?
const InfimaClasses='alert alert--info';function Details_Details(_ref){let{...props}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)(Details,{...props,className:(0,clsx/* default */.A)(InfimaClasses,theme_Details_styles_module.details,props.className)});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Details.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function MDXDetails(props){const items=react.Children.toArray(props.children);// Split summary item from the rest to pass it as a separate prop to the
// Details theme component
const summary=items.find(item=>/*#__PURE__*/react.isValidElement(item)&&item.type==='summary');const children=/*#__PURE__*/(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:items.filter(item=>item!==summary)});return/*#__PURE__*/(0,jsx_runtime.jsx)(Details_Details,{...props,summary:summary,children:children});}
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Heading/index.js + 1 modules
var Heading = __webpack_require__(1107);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Heading.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function MDXHeading(props){return/*#__PURE__*/(0,jsx_runtime.jsx)(Heading/* default */.A,{...props});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Ul/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Ul_styles_module = ({"containsTaskList":"containsTaskList_mC6p"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Ul/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function transformUlClassName(className){// Fix https://github.com/facebook/docusaurus/issues/9098
if(typeof className==='undefined'){return undefined;}return (0,clsx/* default */.A)(className,// This class is set globally by GitHub/MDX. We keep the global class, and
// add another class to get a task list without the default ul styling
// See https://github.com/syntax-tree/mdast-util-to-hast/issues/28
className?.includes('contains-task-list')&&Ul_styles_module.containsTaskList);}function MDXUl(props){return/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{...props,className:transformUlClassName(props.className)});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Li.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function MDXLi(props){// MDX Footnotes have ids such as <li id="user-content-fn-1-953011">
(0,useBrokenLinks/* default */.A)().collectAnchor(props.id);return/*#__PURE__*/(0,jsx_runtime.jsx)("li",{...props});}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Img/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const Img_styles_module = ({"img":"img_ev3q"});
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/Img/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function transformImgClassName(className){return (0,clsx/* default */.A)(className,Img_styles_module.img);}function MDXImg(props){return/*#__PURE__*/ (// eslint-disable-next-line jsx-a11y/alt-text
(0,jsx_runtime.jsx)("img",{decoding:"async",loading:"lazy",...props,className:transformImgClassName(props.className)}));}
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/Admonition/index.js + 15 modules
var Admonition = __webpack_require__(7293);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Noop.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *//* harmony default export */ const Noop = (()=>null);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXComponents/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */const MDXComponents={Head: Head/* default */.A,details:MDXDetails,// For MD mode support, see https://github.com/facebook/docusaurus/issues/9092#issuecomment-1602902274
Details:MDXDetails,code:MDXCode,a:MDXA,pre:MDXPre,ul:MDXUl,li:MDXLi,img:MDXImg,h1:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(MDXHeading,{as:"h1",...props}),h2:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(MDXHeading,{as:"h2",...props}),h3:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(MDXHeading,{as:"h3",...props}),h4:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(MDXHeading,{as:"h4",...props}),h5:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(MDXHeading,{as:"h5",...props}),h6:props=>/*#__PURE__*/(0,jsx_runtime.jsx)(MDXHeading,{as:"h6",...props}),admonition:Admonition/* default */.A,mermaid:Noop};/* harmony default export */ const theme_MDXComponents = (MDXComponents);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/MDXContent/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function MDXContent(_ref){let{children}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)(lib/* MDXProvider */.x,{components:theme_MDXComponents,children:children});}

/***/ }),

/***/ 5195:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TOCItems)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/useThemeConfig.js
var useThemeConfig = __webpack_require__(6342);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/utils/tocUtils.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function treeifyTOC(flatTOC){const headings=flatTOC.map(heading=>({...heading,parentIndex:-1,children:[]}));// Keep track of which previous index would be the current heading's direct
// parent. Each entry <i> is the last index of the `headings` array at heading
// level <i>. We will modify these indices as we iterate through all headings.
// e.g. if an ### H3 was last seen at index 2, then prevIndexForLevel[3] === 2
// indices 0 and 1 will remain unused.
const prevIndexForLevel=Array(7).fill(-1);headings.forEach((curr,currIndex)=>{// Take the last seen index for each ancestor level. the highest index will
// be the direct ancestor of the current heading.
const ancestorLevelIndexes=prevIndexForLevel.slice(2,curr.level);curr.parentIndex=Math.max(...ancestorLevelIndexes);// Mark that curr.level was last seen at the current index.
prevIndexForLevel[curr.level]=currIndex;});const rootNodes=[];// For a given parentIndex, add each Node into that parent's `children` array
headings.forEach(heading=>{const{parentIndex,...rest}=heading;if(parentIndex>=0){headings[parentIndex].children.push(rest);}else{rootNodes.push(rest);}});return rootNodes;}/**
 * Takes a flat TOC list (from the MDX loader) and treeifies it into what the
 * TOC components expect. Memoized for performance.
 */function useTreeifiedTOC(toc){return useMemo(()=>treeifyTOC(toc),[toc]);}function filterTOC(_ref){let{toc,minHeadingLevel,maxHeadingLevel}=_ref;function isValid(item){return item.level>=minHeadingLevel&&item.level<=maxHeadingLevel;}return toc.flatMap(item=>{const filteredChildren=filterTOC({toc:item.children,minHeadingLevel,maxHeadingLevel});if(isValid(item)){return[{...item,children:filteredChildren}];}return filteredChildren;});}/**
 * Takes a flat TOC list (from the MDX loader) and treeifies it into what the
 * TOC components expect, applying the `minHeadingLevel` and `maxHeadingLevel`.
 * Memoized for performance.
 *
 * **Important**: this is not the same as `useTreeifiedTOC(toc.filter(...))`,
 * because we have to filter the TOC after it has been treeified. This is mostly
 * to ensure that weird TOC structures preserve their semantics. For example, an
 * h3-h2-h4 sequence should not be treeified as an "h3 > h4" hierarchy with
 * min=3, max=4, but should rather be "[h3, h4]" (since the h2 heading has split
 * the two headings and they are not parent-children)
 */function useFilteredAndTreeifiedTOC(_ref2){let{toc,minHeadingLevel,maxHeadingLevel}=_ref2;return (0,react.useMemo)(()=>filterTOC({toc:treeifyTOC(toc),minHeadingLevel,maxHeadingLevel}),[toc,minHeadingLevel,maxHeadingLevel]);}
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-common/lib/hooks/useTOCHighlight.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// TODO make the hardcoded theme-classic classnames configurable (or add them
// to ThemeClassNames?)
/**
 * If the anchor has no height and is just a "marker" in the DOM; we'll use the
 * parent (normally the link text) rect boundaries instead
 */function getVisibleBoundingClientRect(element){const rect=element.getBoundingClientRect();const hasNoHeight=rect.top===rect.bottom;if(hasNoHeight){return getVisibleBoundingClientRect(element.parentNode);}return rect;}/**
 * Considering we divide viewport into 2 zones of each 50vh, this returns true
 * if an element is in the first zone (i.e., appear in viewport, near the top)
 */function isInViewportTopHalf(boundingRect){return boundingRect.top>0&&boundingRect.bottom<window.innerHeight/2;}function getAnchors(_ref){let{minHeadingLevel,maxHeadingLevel}=_ref;const selectors=[];for(let i=minHeadingLevel;i<=maxHeadingLevel;i+=1){selectors.push(`h${i}.anchor`);}return Array.from(document.querySelectorAll(selectors.join()));}function getActiveAnchor(anchors,_ref2){let{anchorTopOffset}=_ref2;// Naming is hard: The "nextVisibleAnchor" is the first anchor that appear
// under the viewport top boundary. It does not mean this anchor is visible
// yet, but if user continues scrolling down, it will be the first to become
// visible
const nextVisibleAnchor=anchors.find(anchor=>{const boundingRect=getVisibleBoundingClientRect(anchor);return boundingRect.top>=anchorTopOffset;});if(nextVisibleAnchor){const boundingRect=getVisibleBoundingClientRect(nextVisibleAnchor);// If anchor is in the top half of the viewport: it is the one we consider
// "active" (unless it's too close to the top and and soon to be scrolled
// outside viewport)
if(isInViewportTopHalf(boundingRect)){return nextVisibleAnchor;}// If anchor is in the bottom half of the viewport, or under the viewport,
// we consider the active anchor is the previous one. This is because the
// main text appearing in the user screen mostly belong to the previous
// anchor. Returns null for the first anchor, see
// https://github.com/facebook/docusaurus/issues/5318
return anchors[anchors.indexOf(nextVisibleAnchor)-1]??null;}// No anchor under viewport top (i.e. we are at the bottom of the page),
// highlight the last anchor found
return anchors[anchors.length-1]??null;}function getLinkAnchorValue(link){return decodeURIComponent(link.href.substring(link.href.indexOf('#')+1));}function getLinks(linkClassName){return Array.from(document.getElementsByClassName(linkClassName));}function getNavbarHeight(){// Not ideal to obtain actual height this way
// Using TS ! (not ?) because otherwise a bad selector would be un-noticed
return document.querySelector('.navbar').clientHeight;}function useAnchorTopOffsetRef(){const anchorTopOffsetRef=(0,react.useRef)(0);const{navbar:{hideOnScroll}}=(0,useThemeConfig/* useThemeConfig */.p)();(0,react.useEffect)(()=>{anchorTopOffsetRef.current=hideOnScroll?0:getNavbarHeight();},[hideOnScroll]);return anchorTopOffsetRef;}/**
 * Side-effect that applies the active class name to the TOC heading that the
 * user is currently viewing. Disabled when `config` is undefined.
 */function useTOCHighlight(config){const lastActiveLinkRef=(0,react.useRef)(undefined);const anchorTopOffsetRef=useAnchorTopOffsetRef();(0,react.useEffect)(()=>{if(!config){// No-op, highlighting is disabled
return()=>{};}const{linkClassName,linkActiveClassName,minHeadingLevel,maxHeadingLevel}=config;function updateLinkActiveClass(link,active){if(active){if(lastActiveLinkRef.current&&lastActiveLinkRef.current!==link){lastActiveLinkRef.current.classList.remove(linkActiveClassName);}link.classList.add(linkActiveClassName);lastActiveLinkRef.current=link;// link.scrollIntoView({block: 'nearest'});
}else{link.classList.remove(linkActiveClassName);}}function updateActiveLink(){const links=getLinks(linkClassName);const anchors=getAnchors({minHeadingLevel,maxHeadingLevel});const activeAnchor=getActiveAnchor(anchors,{anchorTopOffset:anchorTopOffsetRef.current});const activeLink=links.find(link=>activeAnchor&&activeAnchor.id===getLinkAnchorValue(link));links.forEach(link=>{updateLinkActiveClass(link,link===activeLink);});}document.addEventListener('scroll',updateActiveLink);document.addEventListener('resize',updateActiveLink);updateActiveLink();return()=>{document.removeEventListener('scroll',updateActiveLink);document.removeEventListener('resize',updateActiveLink);};},[config,anchorTopOffsetRef]);}
// EXTERNAL MODULE: ./node_modules/@docusaurus/core/lib/client/exports/Link.js
var Link = __webpack_require__(8774);
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/TOCItems/Tree.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Recursive component rendering the toc tree
function TOCItemTree(_ref){let{toc,className,linkClassName,isChild}=_ref;if(!toc.length){return null;}return/*#__PURE__*/(0,jsx_runtime.jsx)("ul",{className:isChild?undefined:className,children:toc.map(heading=>/*#__PURE__*/(0,jsx_runtime.jsxs)("li",{children:[/*#__PURE__*/(0,jsx_runtime.jsx)(Link/* default */.A,{to:`#${heading.id}`,className:linkClassName??undefined// Developer provided the HTML, so assume it's safe.
,dangerouslySetInnerHTML:{__html:heading.value}}),/*#__PURE__*/(0,jsx_runtime.jsx)(TOCItemTree,{isChild:true,toc:heading.children,className:className,linkClassName:linkClassName})]},heading.id))});}// Memo only the tree root is enough
/* harmony default export */ const Tree = (/*#__PURE__*/react.memo(TOCItemTree));
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/TOCItems/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */function TOCItems(_ref){let{toc,className='table-of-contents table-of-contents__left-border',linkClassName='table-of-contents__link',linkActiveClassName=undefined,minHeadingLevel:minHeadingLevelOption,maxHeadingLevel:maxHeadingLevelOption,...props}=_ref;const themeConfig=(0,useThemeConfig/* useThemeConfig */.p)();const minHeadingLevel=minHeadingLevelOption??themeConfig.tableOfContents.minHeadingLevel;const maxHeadingLevel=maxHeadingLevelOption??themeConfig.tableOfContents.maxHeadingLevel;const tocTree=useFilteredAndTreeifiedTOC({toc,minHeadingLevel,maxHeadingLevel});const tocHighlightConfig=(0,react.useMemo)(()=>{if(linkClassName&&linkActiveClassName){return{linkClassName,linkActiveClassName,minHeadingLevel,maxHeadingLevel};}return undefined;},[linkClassName,linkActiveClassName,minHeadingLevel,maxHeadingLevel]);useTOCHighlight(tocHighlightConfig);return/*#__PURE__*/(0,jsx_runtime.jsx)(Tree,{toc:tocTree,className:className,linkClassName:linkClassName,...props});}

/***/ }),

/***/ 7763:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ TOC)
});

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/clsx/dist/clsx.mjs
var clsx = __webpack_require__(4164);
// EXTERNAL MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/TOCItems/index.js + 3 modules
var TOCItems = __webpack_require__(5195);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/TOC/styles.module.css
// extracted by mini-css-extract-plugin
/* harmony default export */ const styles_module = ({"tableOfContents":"tableOfContents_bqdL","docItemContainer":"docItemContainer_F8PC"});
// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
;// CONCATENATED MODULE: ./node_modules/@docusaurus/theme-classic/lib/theme/TOC/index.js
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME='table-of-contents__link toc-highlight';const LINK_ACTIVE_CLASS_NAME='table-of-contents__link--active';function TOC(_ref){let{className,...props}=_ref;return/*#__PURE__*/(0,jsx_runtime.jsx)("div",{className:(0,clsx/* default */.A)(styles_module.tableOfContents,'thin-scrollbar',className),children:/*#__PURE__*/(0,jsx_runtime.jsx)(TOCItems/* default */.A,{...props,linkClassName:LINK_CLASS_NAME,linkActiveClassName:LINK_ACTIVE_CLASS_NAME})});}

/***/ }),

/***/ 8426:
/***/ ((module, exports) => {

/**
 * @param {string} string    The string to parse
 * @returns {Array<number>}  Returns an energetic array.
 */
function parsePart(string) {
  let res = [];
  let m;

  for (let str of string.split(",").map((str) => str.trim())) {
    // just a number
    if (/^-?\d+$/.test(str)) {
      res.push(parseInt(str, 10));
    } else if (
      (m = str.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/))
    ) {
      // 1-5 or 1..5 (equivalent) or 1...5 (doesn't include 5)
      let [_, lhs, sep, rhs] = m;

      if (lhs && rhs) {
        lhs = parseInt(lhs);
        rhs = parseInt(rhs);
        const incr = lhs < rhs ? 1 : -1;

        // Make it inclusive by moving the right 'stop-point' away by one.
        if (sep === "-" || sep === ".." || sep === "\u2025") rhs += incr;

        for (let i = lhs; i !== rhs; i += incr) res.push(i);
      }
    }
  }

  return res;
}

exports["default"] = parsePart;
module.exports = parsePart;


/***/ }),

/***/ 8453:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
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