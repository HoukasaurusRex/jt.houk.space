import { defineClientConfig } from 'vuepress/client'
import { defineAsyncComponent, onMounted } from 'vue'
import './theme/styles/index.css'

// Custom layouts
import BlogArticles from './theme/layouts/BlogArticles.vue'
import Post from './theme/layouts/Post.vue'
const NotFound = defineAsyncComponent(() => import('./theme/layouts/NotFound.vue'))

// Global components registered for use in Markdown files
const Cards = defineAsyncComponent(() => import('./theme/global-components/Cards.vue'))
const Card = defineAsyncComponent(() => import('./theme/components/Card.vue'))
import Landing from './theme/global-components/Landing.vue'

export default defineClientConfig({
  layouts: {
    BlogArticles,
    NotFound,
    Post,
  },

  enhance({ app }) {
    app.component('Cards', Cards)
    app.component('Card', Card)
    app.component('Landing', Landing)
  },

  setup() {
    onMounted(() => {
      try {
        if (localStorage.getItem('journal-unlocked') === 'true') {
          document.documentElement.classList.add('journal-unlocked')
        }
      } catch {}
    })
  },

  rootComponents: [],
})
