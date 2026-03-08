import path from 'node:path'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { pwaPlugin } from '@vuepress/plugin-pwa'
import { blogPlugin } from '@vuepress/plugin-blog'
import { seoPlugin } from '@vuepress/plugin-seo'
import { searchPlugin } from '@vuepress/plugin-search'
import tailwindcss from '@tailwindcss/vite'

const isProd = process.env.NODE_ENV === 'production'

export default defineUserConfig({
  lang: 'en-US',
  title: "JT's Space",
  description: 'Dev Blogger • GM • Tinkerer',

  // Exclude draft files
  pagePatterns: ['**/*.md', '!**/*.draft.md', '!.vuepress', '!node_modules'],

  // VuePress 2 client config (replaces enhanceApp.js)
  clientConfigFile: path.resolve(__dirname, './client.ts'),

  bundler: viteBundler({
    viteOptions: {
      plugins: [tailwindcss()],
    },
  }),

  head: [
    ['link', { rel: 'icon', href: '/jt-face-logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: 'rgb(235, 141, 175)' }],
    ['meta', { name: 'theme-color', content: 'rgb(235, 141, 175)' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }],
    ['meta', { name: 'application-name', content: 'JT' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'JT' }],
    ['meta', { name: 'msapplication-navbutton-color', content: 'rgb(235, 141, 175)' }],
    ['meta', { name: 'msapplication-starturl', content: '/' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap' }],
    ['script', {
      'data-website-id': '486ef362-975e-4b9a-aa43-9579256aca2c',
      src: '/umami.js',
      async: '',
      defer: '',
    }],
  ],

  theme: defaultTheme({
    repo: 'HoukasaurusRex/jt.houk.space',
    navbar: [
      { text: 'Articles', link: '/articles/' },
      { text: 'About', link: '/about/' },
      { text: 'RaW', link: 'https://rulesaswrittenshow.com' },
      // { text: 'Get In Touch', link: 'mailto:jt@houk.space?subject=Hello%20From%20Your%20Site&body=' },
    ],
    sidebar: false,
    editLink: false,
    contributors: false,
    lastUpdated: false,
    themePlugins: {
      mediumZoom: false,
    },
  }),

  extendsPage(page) {
    if (page.filePathRelative?.startsWith('articles/') && !page.frontmatter.layout) {
      page.frontmatter.layout = 'Post'
    }
  },

  plugins: [
    blogPlugin({
      // Map frontmatter fields to blog post metadata
      getInfo: ({ frontmatter, title }) => ({
        title,
        author: (frontmatter.author as string) || 'JT Houk',
        date: new Date((frontmatter.created_at as string) || Date.now()),
        category: [(frontmatter.category as string) || 'General'],
        tag: (frontmatter.tags as string[]) || [],
        excerpt: (frontmatter.summary as string) || '',
        image: (frontmatter.image as string) || '',
        location: (frontmatter.location as string) || '',
      }),
      // Only include published markdown files under articles/
      filter: ({ filePathRelative }) =>
        !!(filePathRelative && filePathRelative.startsWith('articles/') && !filePathRelative.endsWith('.draft.md')),
      category: [
        {
          key: 'tag',
          getter: page => (page.frontmatter.tags as string[]) || [],
          path: '/tag/',
          layout: 'BlogArticles',
          itemLayout: 'BlogArticles',
          frontmatter: () => ({ title: 'Tags' }),
          itemFrontmatter: tag => ({ title: `Tag: ${tag}` }),
        },
      ],
      type: [
        {
          key: 'articles',
          // Sort newest first by created_at
          sorter: (a, b) => {
            const aTime = new Date((a.frontmatter.created_at as string) || 0).getTime()
            const bTime = new Date((b.frontmatter.created_at as string) || 0).getTime()
            return bTime - aTime
          },
          filter: ({ filePathRelative }) =>
            !!(filePathRelative && filePathRelative.startsWith('articles/')),
          path: '/articles/',
          layout: 'BlogArticles',
          frontmatter: () => ({ title: 'Articles' }),
        },
      ],
      hotReload: !isProd,
    }),

    pwaPlugin({
      showInstall: false,
      update: 'force',
      cacheHTML: true,
      themeColor: '#eb8daf',
      favicon: '/jt-face-logo.png',
    }),

    seoPlugin({
      hostname: 'https://jt.houk.space',
      ogp: (ogp, page) => ({
        ...ogp,
        'og:image': (page.frontmatter.image as string) || ogp['og:image'],
      }),
    }),

    searchPlugin({}),
  ],
  shouldPrefetch: false,
})
