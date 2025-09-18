import { defineClientConfig } from 'vuepress/client'
import Cards from './theme/components/Cards.vue'
import Comments from './theme/components/Comments.vue'
import Landing from './theme/components/Landing.vue'
import Newsletter from './theme/components/Newsletter.vue'

export default defineClientConfig({
  rootComponents: [
    Cards,
    Comments,
    Landing,
    Newsletter,
  ]
})