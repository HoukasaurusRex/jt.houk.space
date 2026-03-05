import { defineClientConfig } from 'vuepress/client'
import { defineAsyncComponent } from 'vue'
import './theme/styles/index.scss'
import { useColorMode } from './theme/composables/useColorMode'

// Root-level components (rendered outside the page layout)
import Notification from './theme/components/Notification.vue'

// Custom layouts
import BlogArticles from './theme/layouts/BlogArticles.vue'

// Global components registered for use in Markdown files
const Newsletter = defineAsyncComponent(() => import('./theme/global-components/Newsletter.vue'))
const Comments = defineAsyncComponent(() => import('./theme/global-components/Comments.vue'))
const Cards = defineAsyncComponent(() => import('./theme/global-components/Cards.vue'))
const Card = defineAsyncComponent(() => import('./theme/components/Card.vue'))
const Landing = defineAsyncComponent(() => import('./theme/global-components/Landing.vue'))

export default defineClientConfig({
  layouts: {
    BlogArticles,
  },

  enhance({ app }) {
    app.component('Newsletter', Newsletter)
    app.component('Comments', Comments)
    app.component('Cards', Cards)
    app.component('Card', Card)
    app.component('Landing', Landing)
  },

  setup() {
    useColorMode()
  },

  // Render Notification banner at root so it appears on every page
  rootComponents: [Notification],
})
