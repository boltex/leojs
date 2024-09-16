// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

const organizationName = "boltex";
const projectName = "leojs";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LeoJS',
  tagline: 'Literate Editor with Outlines',
  favicon: 'img/favicon.ico',

  url: `https://${organizationName}.github.io`,
  baseUrl: `/${projectName}/`,

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
          src: 'img/leoapp256px.png',
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
          // {
          //   type: 'doc',
          //   docId: 'appendices/glossary',
          //   label: 'Glossary',
          //   position: 'right',
          // },
          {
            'aria-label': 'GitHub Repository',
            className: 'navbar--github-link',
            position: 'right',
            href: 'https://github.com/boltex/leojs',
            title: "GitHub Repository"
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
      footer: {
        // style: "dark", // Comment off for customized styles from custom.css
        links: [
          {
            title: 'Original Leo Editor',
            items: [
              {
                label: 'Leo’s Home Page',
                href: 'https://leo-editor.github.io/leo-editor/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Leo’s Forum',
                href: 'https://groups.google.com/g/leo-editor',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/boltex/leojs',
              },
            ],
          },
          {
            title: 'About',
            items: [
              {
                label: 'Support LeoJS',
                href: 'https://boltex.github.io',
              },
            ],
          },
        ],
        copyright: `Copyright © 1996-${new Date().getFullYear()} <a class="footer__link-item" href="https://github.com/edreamleo/" target="_blank" title="Edward K. Ream on Github">Edward K. Ream</a> and <a class="footer__link-item" href="https://github.com/boltex/" target="_blank" title="Félix Malboeuf on Github">Félix Malboeuf</a>.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.oneDark,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: '3O12YAXPHG',

        // Public API key: it is safe to commit it
        apiKey: 'f3496193458172c3b4a11a6aa5c701bc',

        indexName: 'boltexio',

        // Optional: see doc section below
        contextualSearch: false,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push.
        // Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl.
        // You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: false,
      }

    }),
  customFields: {
    quotesList: [
      {
        quote: 'Leo is a powerful tool for organizing text into tree structures, and for just generally attacking a number of problems from a tree-based perspective.',
        author: 'Joe Orr'
      },
      {
        quote: 'The range of activities that Leo can support is amazingly wide. That’s why it’s hard to tell someone what Leo “is”. It’s like the elephant and the blind men - none of them can see the whole of the elephant.',
        author: 'Thomas Passin'
      },
      {
        quote: 'I am a huge fan of Leo. I think it’s quite possibly the most revolutionary programming tool I have ever used and it (along with the Python language) has utterly changed my view of programming (indeed of writing) forever.',
        author: 'Shakeeb Alireza'
      },
      {
        quote: 'Thank you very much for Leo. The main concept that impress me is that the source listing isn’t the main focus any more. You focus on the non-linear, hierarchical, collapsible outline of the source code.',
        author: 'Korakot Chaovavanich'
      },
      {
        quote: 'Leo is a quantum leap for me in terms of how many projects I can manage and how much information I can find and organize and store in a useful way.',
        author: 'Dan Winkler'
      },
      {
        quote: 'When first I opened Leo, it was out of curiosity. But having used it…I’ll never go back. They’ll have to pry Leo out of my cold, dead fingers!',
        author: 'Travers A. Hough'
      },
      {
        quote: 'Leo is a marriage of outlining and programming. Pure genius.',
        author: 'Austin King'
      },
      {
        quote: 'I have been using it now for about 2–3 months. It has totally changed not only the way that I program, but also the way that I store and organize all of the information that I need for the job that I do.',
        author: 'Ian Mulvany'
      },
      {
        quote: 'I’m absolutely astounded by the power of such a simple idea! It works great and I can immediately see the benefits of using Leo in place of the standard flat file editor.',
        author: 'Tom Lee'
      },
      {
        quote: 'Leo is an interactive editor for organizing text fragments hierarchically and sequentially into one or more files and hierarchical folders, without arbitrary limits on the number and size of text fragments and the depth of the hierarchy…',
        author: 'Alex Abacus'
      },
      {
        quote: 'Leo creates living documents. Ideas can be organized and reorganized gradually and then inserted into the appropriate place in a project. Outlines become fluid, allowing infinite depth and by using clones of nodes, arbitrary levels of complexity… Instead of imposing structure, it allows you to impose your own, and then be as creative as you want.',
        author: 'Chris George'
      },
      {
        quote: 'Cloning is pure genius!… Leo’s cloning facility, allows me to create several views on the CFA course material. My main view follows the prescribed study guide. Another view is organized like the textbooks. Yet another gives me a glossary of terms. And when I’m done, I’ll have some nice libraries…I can re-use later in other projects.',
        author: 'Michael Manti'
      },
      {
        quote: 'Just as structured programming reveals and disciplines the flow control of a program, [Leo] allows the designer to reveal and discipline structure at many layers simultaneously: data structures, object structure, entity-relationship structure, client-server structure, design pattern structure, temporal structure, project management structure, and any other structure relevant to the system.',
        author: 'Steven P. Schaefer'
      }
    ]
  }
};

export default config;
