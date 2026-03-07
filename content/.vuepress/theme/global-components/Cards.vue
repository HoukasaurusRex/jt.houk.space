<template>
  <main class="cards">
    <slot name="top" />
    <div v-for="item in filteredRoutes" :key="item.path">
      <Card
        :name="item.title"
        :url="item.path"
        :image-url="item.imageUrl"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoutes, usePageData } from '@vuepress/client'
import Card from '../components/Card.vue'

const routes = useRoutes()
const page = usePageData()

interface CardItem { path: string; title: string; imageUrl?: string }

const filteredRoutes = computed<CardItem[]>(() => {
  const currentPath = page.value.path
  return Object.entries(routes.value)
    .filter(([path]) => path !== currentPath && path.startsWith(currentPath))
    .map(([path, meta]) => ({
      path,
      title: (meta as { title?: string }).title || path,
      imageUrl: undefined,
    }))
    .sort((a, b) => a.title.localeCompare(b.title))
})
</script>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  grid-auto-rows: auto;
  grid-gap: 2rem;
}
</style>
