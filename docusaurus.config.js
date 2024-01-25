// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Bastions of will',
  tagline: 'Site under construction',
  favicon: 'img/favicon.ico',

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  // themes: ['@docusaurus/theme-search-algolia'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Bastions of will',
        logo: {
          alt: 'Bastions of will logo',
          src: 'img/docusaurus.png',
        },
        items: [
          {to: '/docs/tutorial-basics/congratulations', label: 'About', position: 'left'},
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/bastionsofwill',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'TECS',
                to: '/docs/category/the-elements-of-computing-systems',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/bastionsofwill',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} bastionsofwill`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      // algolia: {
      //   // The application ID provided by Algolia
      //   appId: 'YOUR_APP_ID',
  
      //   // Public API key: it is safe to commit it
      //   apiKey: 'YOUR_SEARCH_API_KEY',
  
      //   indexName: 'YOUR_INDEX_NAME',
  
      //   // Optional: see doc section below
      //   contextualSearch: true,
  
      //   // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      //   externalUrlRegex: 'external\\.com|domain\\.com',
  
      //   // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      //   replaceSearchResultPathname: {
      //     from: '/docs/', // or as RegExp: /\/docs\//
      //     to: '/',
      //   },
  
      //   // Optional: Algolia search parameters
      //   searchParameters: {},
  
      //   // Optional: path for search page that enabled by default (`false` to disable it)
      //   searchPagePath: 'search',
  
      //   //... other Algolia params
      // },
    }),
};

export default config;
