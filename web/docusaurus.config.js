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
        appId: '3O12YAXPHG',
        apiKey: 'b544bf896974ca6d1444fe87aabfeb14',
        rateLimit: 8,
        maxDepth: 10,
        startUrls: ['https://boltex.github.io/leojs/'],
        sitemaps: ['https://boltex.github.io/leojs/sitemap.xml'],
        ignoreCanonicalTo: true,
        discoveryPatterns: ['https://boltex.github.io/leojs/**'],
        actions: [
          {
            indexName: 'boltexio',
            pathsToMatch: ['https://boltex.github.io/leojs/**'],
            recordExtractor: ({ $, helpers }) => {
              // priority order: deepest active sub list header -> navbar active item -> 'Documentation'
              const lvl0 =
                $(
                  '.menu__link.menu__link--sublist.menu__link--active, .navbar__item.navbar__link--active'
                )
                  .last()
                  .text() || 'Documentation';

              return helpers.docsearch({
                recordProps: {
                  lvl0: {
                    selectors: '',
                    defaultValue: lvl0,
                  },
                  lvl1: ['header h1', 'article h1'],
                  lvl2: 'article h2',
                  lvl3: 'article h3',
                  lvl4: 'article h4',
                  lvl5: 'article h5, article td:first-child',
                  lvl6: 'article h6',
                  content: 'article p, article li, article td:last-child',
                },
                indexHeadings: true,
                aggregateContent: true,
                recordVersion: 'v3',
              });
            },
          },
        ],
        initialIndexSettings: {
          YOUR_INDEX_NAME: {
            attributesForFaceting: [
              'type',
              'lang',
              'language',
              'version',
              'docusaurus_tag',
            ],
            attributesToRetrieve: [
              'hierarchy',
              'content',
              'anchor',
              'url',
              'url_without_anchor',
              'type',
            ],
            attributesToHighlight: ['hierarchy', 'content'],
            attributesToSnippet: ['content:10'],
            camelCaseAttributes: ['hierarchy', 'content'],
            searchableAttributes: [
              'unordered(hierarchy.lvl0)',
              'unordered(hierarchy.lvl1)',
              'unordered(hierarchy.lvl2)',
              'unordered(hierarchy.lvl3)',
              'unordered(hierarchy.lvl4)',
              'unordered(hierarchy.lvl5)',
              'unordered(hierarchy.lvl6)',
              'content',
            ],
            distinct: true,
            attributeForDistinct: 'url',
            customRanking: [
              'desc(weight.pageRank)',
              'desc(weight.level)',
              'asc(weight.position)',
            ],
            ranking: [
              'words',
              'filters',
              'typo',
              'attribute',
              'proximity',
              'exact',
              'custom',
            ],
            highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight">',
            highlightPostTag: '</span>',
            minWordSizefor1Typo: 3,
            minWordSizefor2Typos: 7,
            allowTyposOnNumericTokens: false,
            minProximity: 1,
            ignorePlurals: true,
            advancedSyntax: true,
            attributeCriteriaComputedByMinProximity: true,
            removeWordsIfNoResults: 'allOptional',
            separatorsToIndex: '_',
          },
        },
      }

    }),
  customFields: {
    quotesList: [
      {
        quote: 'We who use Leo know that it is a breakthrough tool and a whole new way of writing code.',
        author: 'Joe Orr'
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
        quote: 'I have been absolutely seduced by Leo over the past few days. I tell you, I can not put it down. I feel like a kid with a shiny new bike…I’m already bursting with new ways I’d like to use the tool in the future.',
        author: 'Lyn Adams Headley'
      },
      {
        quote: 'Leo should either replace or greatly augment the development tools that I use.',
        author: 'Zak Greant'
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
        quote: 'I only have one week of Leo experience but I already know it will be my default IDE/project manager…',
        author: 'Marshall Parsons'
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
        quote: 'Leo reminds me a great deal of things I loved when I used Userland’s Frontier (an outlining cms with a native oodb) - but Frontier wasn’t hackable enough for me, and it wasn’t oriented towards coding…, and you couldn’t round-trip rendered pages (big Leo win). This is really a super tool - in a matter of days I’ve started to use it on all my projects and I still haven’t figured out how I lived without it.',
        author: 'John Sequeira'
      },
      {
        quote: 'Leo is EXACTLY the kind of outliner I was looking for–fantastic job!',
        author: 'Steve Allen'
      },
      {
        quote: 'Leo creates living documents. Ideas can be organized and reorganized gradually and then inserted into the appropriate place in a project. Outlines become fluid, allowing infinite depth and by using clones of nodes, arbitrary levels of complexity… Instead of imposing structure, it allows you to impose your own, and then be as creative as you want.',
        author: 'Chris George'
      },
      {
        quote: 'If you are like me, you have a kind of knowledge base with infos gathered over time. And you have projects, where you use some of those infos. Now, with conventional outliners you begin to double these infos, because you want to have the infos needed for the project with your project. With Leo you can do this too, but if you change text in one place IT IS UPDATED IN THE OTHER PLACE TOO! This is a feature I did not see with any other outliner (and I tried a few). Amazing! Leo directly supports the way I work!',
        author: 'F. Geiger'
      },
      {
        quote: 'Cloning is pure genius!… Leo’s cloning facility, allows me to create several views on the CFA course material. My main view follows the prescribed study guide. Another view is organized like the textbooks. Yet another gives me a glossary of terms. And when I’m done, I’ll have some nice libraries…I can re-use later in other projects.',
        author: 'Michael Manti'
      },
      {
        quote: 'A Leo file is an ideal documentation tool, collecting the assorted readme.txt files, the comments from the source files…as well as the config files themselves.',
        author: 'Kent Tenney'
      },
      {
        quote: 'Just as structured programming reveals and disciplines the flow control of a program, [Leo] allows the designer to reveal and discipline structure at many layers simultaneously: data structures, object structure, entity-relationship structure, client-server structure, design pattern structure, temporal structure, project management structure, and any other structure relevant to the system.',
        author: 'Steven P. Schaefer'
      },
      {
        quote: 'A funny observation with Leo is that when I ‘Leo-ise’ other people’s code, Leo makes the code’s structure so transparent that design faults become very quickly apparent. For example, maintenance pain caused by lack of factorization.',
        author: 'David McNab'
      },
      {
        quote: 'Leo is a powerful tool for organizing text into tree structures, and for just generally attacking a number of problems from a tree-based perspective.',
        author: 'Joe Orr'
      },
      {
        quote: 'The range of activities that Leo can support is amazingly wide. That’s why it’s hard to tell someone what Leo “is”. It’s like the elephant and the blind men - none of them can see the whole of the elephant.',
        author: 'Thomas Passin'
      }

    ]
  }
};

export default config;
