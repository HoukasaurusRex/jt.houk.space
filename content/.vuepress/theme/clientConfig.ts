import { defineClientConfig } from 'vuepress/client'
import Layout from './layouts/Layout.vue'
import Post from './layouts/Post.vue'
import BlogCategory from './layouts/BlogCategory.vue'
import ArticleList from './components/ArticleList.vue'
import CategoryPage from './components/CategoryPage.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('ArticleList', ArticleList)
    app.component('CategoryPage', CategoryPage)
  },
  layouts: {
    Layout,
    Post,
    BlogCategory,
  },
})
