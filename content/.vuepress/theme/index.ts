import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default {
  name: 'vuepress-theme-local',
  extends: '@vuepress/theme-default',
  layouts: {
    Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
    Post: path.resolve(__dirname, 'layouts/Post.vue'),
  },
}
