// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Learning-Threejs',
  tagline: 'Dinosaurs are cool',
  url: 'https://learning-threejs.happtim.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/icon.svg',
  organizationName: 'happtim', // Usually your GitHub org/user name.
  projectName: 'learning-threejs', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/happtim/learning-threejs/blob/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/happtim/learning-threejs/blob/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'learning-threejs',
        logo: {
          alt: 'My Site Logo',
          src: 'img/icon.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: '学习 Three.js',
          },
          {
            type:'dropdown',
            label:'Three.js Docs',
            position:'left',
            items:[
              {
                to:'/three.js-r133/docs/index.html',
                label:'Three.js r133 Docs',
                target: '_blank',
              },
              {
                href:'https://threejs.org/docs/index.html',
                label:'Three.js Docs Online',
              }
            ]
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/happtim/learning-threejs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '学习 Three.js',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Website',
            items: [
              {
                label: 'threejs',
                href: 'https://threejs.org/',
              },
              {
                label: 'threejs doc',
                href: 'https://threejs.org/docs/index.html',
              }

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
                href: 'https://github.com/happtim/learning-threejs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} happtim.com .Built with Docusaurus.<br/>晋ICP备2022001995`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
