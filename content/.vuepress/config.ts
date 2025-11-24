import { defineUserConfig } from 'vuepress'
import { getDirname, path } from 'vuepress/utils'
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { pwaPlugin } from '@vuepress/plugin-pwa'
import { blogPlugin } from '@vuepress/plugin-blog'
import { commentPlugin } from '@vuepress/plugin-comment'
import { feedPlugin } from '@vuepress/plugin-feed'
import vuetify from 'vite-plugin-vuetify'
import dotenv from 'dotenv'

dotenv.config()


const __dirname = import.meta.dirname || getDirname(import.meta.url)

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      plugins: [vuetify({ autoImport: true })],
      ssr: {
        noExternal: ['vuetify'],
      },
    },
  }),
  title: 'JT\'s Space',
  description: 'Software Engineer • Cloud Architect • DevOps',
  shouldPrefetch: false,
  // metaDescription: 'A space for JT Houk\'s thoughts, works, and ideas. I\'m a Software Engineer • Cloud Architect • DevOps guy living in the web. Shoot me an email or contact me on Twitter for collaborations, freelancing, or talking tech!',
  // image: 'https://jt.houk.space/assets/8bitme-right.jpg',
  // patterns: ['**/*.md', '**/*.vue', '!**/*.draft.md'],
  // tags: [
  //   'JT',
  //   'Houk',
  //   'Freelance',
  //   'Developer',
  //   'Cloud Architect',
  //   'DevOps',
  //   'Full Stack'
  // ],
  // serviceWorker: true,
  // evergreen: true,
  plugins: [
    registerComponentsPlugin({
      componentsDir: `${__dirname}/theme/components`,
      componentsPatterns: ['**/*.vue'],
    }),
    pwaPlugin({
      favicon: '/jt-face-logo.png',
      themeColor: '#eb8da7',
      update: 'available',
      manifest: {
        name: 'JT Houk',
        short_name: 'JT',
        description: 'Software Engineer • Cloud Architect • DevOps',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#eb8da7',
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
    }),
    blogPlugin({
      hotReload: true,
      filter: ({ filePathRelative }) => {
        // Only include markdown files in articles directory (exclude index)
        if (!filePathRelative) return false
        return filePathRelative.startsWith('articles/')
          && filePathRelative !== 'articles/README.md'
      },
      getInfo: ({ frontmatter, title }) => ({
        title: title || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tags || [],
        excerpt: frontmatter.summary || frontmatter.description || '',
      }),
      category: [
        {
          key: 'category',
          getter: (page) => {
            const category = page.frontmatter.category
            if (!category) return []
            if (typeof category === 'string') return [category]
            if (Array.isArray(category)) return category.filter((c): c is string => typeof c === 'string')
            return []
          },
          frontmatter: () => ({
            title: 'Categories',
            sidebar: false,
          }),
        },
        {
          key: 'tag',
          getter: (page) => {
            const tags = page.frontmatter.tags
            if (!tags) return []
            if (Array.isArray(tags)) return tags.filter((t): t is string => typeof t === 'string')
            if (typeof tags === 'string') return [tags]
            return []
          },
          frontmatter: () => ({
            title: 'Tags',
            sidebar: false,
          }),
        },
      ],
    }),
    commentPlugin({
      provider: 'Giscus',
      repo: 'HoukasaurusRex/jt.houk.space',
      repoId: 'MDEwOlJlcG9zaXRvcnkxOTA3MTk5NzM=',
      category: 'Announcements',
      categoryId: 'DIC_kwDOC14n5c4CyAtn',
      mapping: 'pathname',
      strict: false,
      reactionsEnabled: true,
      inputPosition: 'top',
      darkTheme: 'dark',
      lightTheme: 'light',
      lazyLoading: true,
    }),
    feedPlugin({
      hostname: 'https://jt.houk.space',
      atom: true,
      json: true,
      rss: true,
      count: 20,
      filter: ({ filePathRelative }) => {
        // Only include articles (not drafts)
        if (!filePathRelative) return false
        return filePathRelative.startsWith('articles/')
          && !filePathRelative.includes('.draft')
          && filePathRelative !== 'articles/README.md'
      },
      sorter: (a, b) => {
        const dateA = a.frontmatter.created_at ? new Date(a.frontmatter.created_at as string).getTime() : 0
        const dateB = b.frontmatter.created_at ? new Date(b.frontmatter.created_at as string).getTime() : 0
        return dateB - dateA
      },
    })
  ],
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
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' }],
    ['script', {
      ['data-host']: 'https://microanalytics.io',
      src: 'https://microanalytics.io/js/script.js',
      id: process.env.MICRO_ANALYTICS_ID || '',
      async: true,
      defer: true
    }]
    // ['script', { async: true, src: 'https://platform.twitter.com/widgets.js', charset: 'utf-8' }]
  ],
  theme: defaultTheme({
    logo: '/jt-face-logo.png',
    logoDark: '/jt-face-logo-dark.png',
    repo: 'HoukasaurusRex/jt.houk.space',
    repoLabel: 'GitHub',
    docsDir: 'content',
    docsBranch: 'main',
    editLinkText: 'Edit this page on GitHub',
    lastUpdatedText: 'Last Updated',
    contributorsText: 'Contributors',
    notFound: ['404 Not Found'],
    backToHome: 'Go Back Home',
    selectLanguageName: 'English',
    selectLanguageText: 'Select Language',
    selectLanguageAriaLabel: 'Select Language',
    openInNewWindow: 'Open in New Window',
    hostname: 'https://jt.houk.space',
    // smoothScroll: true,
    // env: {
    //   CMS_API: process.env.CMS_API,
    //   DISQUS_API_KEY: process.env.DISQUS_API_KEY
    // },
    // notification: {
    //   id: 'irc-afghan-refugees',
    //   title: 'Help Refugees in Afghanistan',
    //   description: 'Donate to the IRC to provide humanitarian aid and resettlement resources to Afghan refugees',
    //   link: 'https://help.rescue.org/donate/afghanistan'
    // },
    navbar: [
      {
        text: 'Articles',
        link: '/articles/'
      },
      {
        text: 'Portfolio',
        link: '/projects/'
      },
      {
        text: 'About',
        link: '/about/'
      },
      {
        text: 'Labs',
        link: 'https://labs.houk.space'
      },
      {
        text: 'RaW',
        link: 'https://rulesaswrittenshow.com'
      },
      {
        text: 'Get In Touch',
        link: 'mailto:jt@houk.space?subject=Hello%20From%20Your%20Site&body='
      }
    ],
    sidebar: {
      '/articles/': [
        {
          text: 'Articles',
          children: [
            '/articles/dev-log.md',
            '/articles/agile-cooking.md',
            '/articles/a-weekly-commute-in-podcasts.md',
            '/articles/how-to-track-indoor-air-pollution-with-a-raspberry-pi.md',
            '/articles/making-a-bastion-host.md',
            '/articles/how-to-configure-ssl-on-aliyun-dns-for-an-aws-application-load-balancer-for--0.md',
          ],
        },
      ],
      '/projects/': [
        {
          text: 'Portfolio',
          children: [
            '/projects/',
            '/projects/akkadu.md',
            '/projects/pitchor.md',
            '/projects/rules-as-written.md',
            '/projects/zentone.md',
          ],
        },
      ],
    },
    // footer: {
    //   contact: [
    //     {
    //       type: 'github',
    //       link: 'https://github.com/HoukasaurusRex',
    //     },
    //     {
    //       type: 'twitter',
    //       link: 'https://twitter.com/HoukasaurusRex',
    //     },
    //     {
    //       type: 'linkedin',
    //       link: 'https://linkedin.com/in/jt-houk'
    //     },
    //     {
    //       type: 'mail',
    //       link: 'mailto:jt@houk.space?subject=Hello%20From%20Your%20Site&body='
    //     }
    //   ],
    //   copyright: [{
    //     text: `JT Houk © ${new Date().getFullYear()}`
    //   }]
    // },
    // directories: [
    //   {
    //     id: 'articles', // Unique id for current classifier
    //     dirname: 'articles', // Matched directory name
    //     path: '/articles/', // Entry page for current classifier
    //     title: 'Articles', // Entry and pagination page titles for current classifier
    //     // itemLayout: 'Writing', // Layout for matched pages.
    //     itemPermalink: '/articles/:slug', // Permalink for matched pages.
    //     pagination: { // Pagination behavior
    //       lengthPerPage: 5,
    //     },
    //     frontmatter: {
    //       type: 'post',
    //       feed: {
    //         enable: true
    //       }
    //     }
    //   }
    // ],
    // feed: {
    //   canonical_base: 'https://jt.houk.space'
    // },
  })
})