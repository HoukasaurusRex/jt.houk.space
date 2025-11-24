<template>
  <ParentLayout v-if="!isCategoryPage">
    <template #page-top>
      <Notification />
    </template>
    <template #page-bottom>
      <Footer />
    </template>
  </ParentLayout>
  <div v-else class="theme-container">
    <div class="theme-default-content">
      <CategoryPage :category-key="categoryKey" />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '@vuepress/client'
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import Notification from '../components/Notification.vue'
import Footer from '../components/Footer.vue'
import CategoryPage from '../components/CategoryPage.vue'

const route = useRoute()

const isCategoryPage = computed(() => {
  return route.path.startsWith('/category/') || route.path.startsWith('/tag/')
})

const categoryKey = computed(() => {
  if (route.path.startsWith('/tag/')) return 'tag'
  if (route.path.startsWith('/category/')) return 'category'
  return ''
})
</script>
