// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LeoJS',
  tagline: 'Literate Editor with Outlines',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://felixworkshop.com/',

  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // baseUrl: '/leojs/', // ! TO DEPLOY IN /leojs/
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'boltex', // Usually your GitHub org/user name.
  projectName: 'leojs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ['rss', 'atom'],
        //     xslt: true,
        //   },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/leojs-social-card.png',
      navbar: {
        title: 'LeoJS',
        hideOnScroll: true,
        logo: {
          alt: 'LeoJS Logo',
          src: 'img/logo.svg',
        },
        items: [
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          {
            type: 'docSidebar',
            sidebarId: 'gettingStartedSidebar',
            position: 'left',
            label: 'Getting Started',
          },
          {
            type: 'docSidebar',
            sidebarId: 'usersGuideSidebar',
            position: 'left',
            label: 'User\'s Guide',
          },
          {
            type: 'docSidebar',
            sidebarId: 'advancedTopicsSidebar',
            position: 'left',
            label: 'Advanced Topics',
          },
          {
            type: 'docSidebar',
            sidebarId: 'appendicesSidebar',
            position: 'left',
            label: 'Appendices',
          },
          // { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/boltex/leojs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      // announcementBar: {
      //   id: 'leojs_available',
      //   content:
      //     'LeoJS is now available in the VSCode marketplace, and in VSCodium\'s Open VSX Registry!',
      //   backgroundColor: '#fafbfc',
      //   textColor: '#091E42',
      //   isCloseable: false,
      // },
      // footer: {
      //   style: "dark", // Comment off for customized styles from custom.css
      //   links: [
      //     {
      //       title: 'Docs',
      //       items: [
      //         {
      //           label: 'Tutorial',
      //           to: '/docs/intro',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'Community',
      //       items: [
      //         {
      //           label: 'Leo\'s Forum',
      //           href: 'https://groups.google.com/g/leo-editor',
      //         },
      //       ],
      //     },
      //     {
      //       title: 'More',
      //       items: [
      //         // {
      //         //   label: 'Blog',
      //         //   to: '/blog',
      //         // },
      //         {
      //           label: 'GitHub',
      //           href: 'https://github.com/boltex/leojs',
      //         },
      //       ],
      //     },
      //   ],
      //   copyright: `Copyright © 1997-${new Date().getFullYear()} Edward K. Ream and Félix Malboeuf.`,
      // },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
