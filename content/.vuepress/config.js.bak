const getConfig = require('vuepress-bar')
require('dotenv-defaults').config()

const articles = getConfig(`${__dirname}/../articles`)
const portfolio = getConfig(`${__dirname}/../projects`)
portfolio.sidebar[0] = ['/projects/', '<- Back to Portfolio']

const exists = (item) => item && item !==' ...' ? item : null

module.exports = {
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({ GA_ID: JSON.stringify(false) })
    ]
  },
  title: 'JT\'s Space',
  description: 'Software Engineer • Cloud Architect • DevOps',
  metaDescription: 'A space for JT Houk\'s thoughts, works, and ideas. I\'m a Software Engineer • Cloud Architect • DevOps guy living in the web. Shoot me an email or contact me on Twitter for collaborations, freelancing, or talking tech!',
  image: 'https://jt.houk.space/assets/8bitme-right.jpg',
  patterns: ['**/*.md', '**/*.vue', '!**/*.draft.md'],
  tags: [
    'JT',
    'Houk',
    'Freelance',
    'Developer',
    'Cloud Architect',
    'DevOps',
    'Full Stack'
  ],
  serviceWorker: true,
  evergreen: true,
  plugins: [
    // Inline SEO plugin: vuepress-plugin-seo@0.2.0 uses `extendsPageData` which VuePress 1.x
    // does not recognize (it expects `extendPageData`), so no OG tags were ever injected.
    // Inline SEO plugin: vuepress-plugin-seo@0.2.0 uses `extendsPageData` which VuePress 1.x
    // does not recognize (expects `extendPageData`), so no OG tags were ever injected.
    // Also, VuePress SSR renders page meta from `frontmatter.meta` (plain objects), not
    // `frontmatter.head` (head array format) — so this plugin writes to the correct array.
    (_, context) => ({
      name: 'seo',
      extendPageData($page) {
        const $site = context.siteConfig
        const meta = $page.frontmatter.meta || []

        const addMeta = (nameOrProp, content) => {
          if (!content) return
          const attribute = ['article:', 'og:'].some(type => nameOrProp.startsWith(type)) ? 'property' : 'name'
          if (meta.findIndex(m => m[attribute] === nameOrProp) !== -1) return
          meta.push({ [attribute]: nameOrProp, content })
        }

        const hostname = $site.themeConfig.hostname || ('https://' + $site.themeConfig.domain) || ''
        const title = exists($page.frontmatter.title) || $page.title || $site.title
        const description = exists($page.frontmatter.description) || exists($page.frontmatter.summary) || $site.metaDescription || $site.description
        const image = exists($page.frontmatter.image) || $site.image
        const url = hostname + $page.path
        const type = ['articles', 'posts', 'blog'].some(f => ($page.regularPath || '').startsWith('/' + f)) ? 'article' : 'website'
        const twitterCard = $page.frontmatter.image ? 'summary_large_image' : 'summary'
        const publishedAt = $page.frontmatter.created_at && new Date($page.frontmatter.created_at).toISOString()

        addMeta('og:site_name', $site.title)
        addMeta('og:title', title)
        addMeta('og:description', description)
        addMeta('og:type', type)
        addMeta('og:url', url)
        addMeta('og:image', image)
        addMeta('twitter:card', twitterCard)
        addMeta('twitter:title', title)
        addMeta('twitter:description', description)
        addMeta('twitter:url', url)
        addMeta('twitter:image', image)
        addMeta('twitter:image:src', image)
        addMeta('twitter:creator', $site.themeConfig.author)
        addMeta('article:published_time', publishedAt)

        if ($page.frontmatter.tags && Array.isArray($page.frontmatter.tags)) {
          addMeta('twitter:label2', 'Filed under')
          addMeta('twitter:data2', $page.frontmatter.tags.join(', '))
        }

        $page.frontmatter.meta = meta
      }
    }),
    ['vuepress-plugin-mailchimp', {
      endpoint: process.env.MC_API,
      title: 'Subscribe',
      content: 'Get my latest posts. No spam.',
      submitText: 'Subscribe',
      popupConfig: {
        enabled: popupEnabled = true,
        timeout: popupTimeout = 4000
      }
    }],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: true,
      skipWaiting: true
    }]
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
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover' }],
    ['script', {
      ['data-website-id']: '486ef362-975e-4b9a-aa43-9579256aca2c',
      src: '/umami.js',
      async: true,
      defer: true
    }]
    // ['script', { async: true, src: 'https://platform.twitter.com/widgets.js', charset: 'utf-8' }]
  ],
  themeConfig: {
    repo: 'HoukasaurusRex',
    author: '@HoukasaurusRex',
    domain: 'jt.houk.space',
    hostname: 'https://jt.houk.space',
    smoothScroll: true,
    env: {
      CMS_API: process.env.CMS_API,
      DISQUS_API_KEY: process.env.DISQUS_API_KEY
    },
    notification: {
      id: 'irc-donate-gaza',
      title: 'Help families in Gaza',
      description: 'Donate to the IRC to provide humanitarian aid and resettlement resources to families in Gaza',
      link: 'https://help.rescue.org/donate'
    },
    nav: [
      {
        text: 'Articles',
        link: '/articles/'
      },
      // {
      //   text: 'Portfolio',
      //   link: '/projects/'
      // },
      {
        text: 'About',
        link: '/about/'
      },
      // {
      //   text: 'Labs',
      //   link: 'https://labs.houk.space'
      // },
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
      '/articles/': articles.sidebar,
      '/projects/': portfolio.sidebar
    },
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/HoukasaurusRex',
        },
        {
          type: 'linkedin',
          link: 'https://linkedin.com/in/jt-houk'
        },
        {
          type: 'mail',
          link: 'mailto:jt@houk.space?subject=Hello%20From%20Your%20Site&body='
        }
      ],
      copyright: [{
        text: `JT Houk © ${new Date().getFullYear()}`
      }]
    },
    directories: [
      {
        id: 'articles', // Unique id for current classifier
        dirname: 'articles', // Matched directory name
        path: '/articles/', // Entry page for current classifier
        title: 'Articles', // Entry and pagination page titles for current classifier
        // itemLayout: 'Writing', // Layout for matched pages.
        itemPermalink: '/articles/:slug', // Permalink for matched pages.
        pagination: { // Pagination behavior
          lengthPerPage: 5,
          sorter: (prev, next) => {
            const prevTime = new Date(prev.frontmatter.created_at).getTime()
            const nextTime = new Date(next.frontmatter.created_at).getTime()
            return nextTime - prevTime // Sort descending (newest first)
          }
        },
        frontmatter: {
          type: 'post',
          feed: {
            enable: true
          }
        }
      }
    ],
    feed: {
      canonical_base: 'https://jt.houk.space'
    },
  }
}