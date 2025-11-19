<template>
  <main class="cards">
    <slot name="top"/>
    <div v-for="(page, index) in pages" :key="page.path">
      <Card
        :name="page.title"
        :url="page.path"
        :imageUrl="page.frontmatter.screenshots?.[0]?.url"
      />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { usePageData, useSiteData } from 'vuepress/client'
import Card from './Card.vue'

export default defineComponent({
  name: 'Cards',
  components: { Card },
  setup() {
    const page = usePageData()
    const site = useSiteData()

    const pages = computed(() => {
      const allPages = site.value.pages || []
      return allPages
        .filter((p: any) => p.path.includes(page.value.path))
        .filter((p: any) => p.title)
        .sort((a: any, b: any) => {
          const dateA = a.frontmatter?.date ? new Date(a.frontmatter.date).getTime() : 0
          const dateB = b.frontmatter?.date ? new Date(b.frontmatter.date).getTime() : 0
          return dateB - dateA
        })
    })

    return {
      pages,
    }
  },
})
</script>

<style lang="scss" scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  grid-auto-rows: auto;
  grid-gap: 2rem;
}
</style>
