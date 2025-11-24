<template>
  <div class="category-page">
    <div class="category-header">
      <h1>{{ categoryTitle }}</h1>
      <p v-if="categoryItems.length" class="article-count">
        {{ categoryItems.length }} article{{ categoryItems.length !== 1 ? 's' : '' }}
      </p>
    </div>

    <div v-if="categoryItems.length" class="articles-list">
      <article
        v-for="item in categoryItems"
        :key="item.path"
        class="article-item"
      >
        <h2>
          <a :href="item.path">{{ item.info.title }}</a>
        </h2>
        <div class="article-meta">
          <time v-if="item.info.date" :datetime="item.info.date">
            {{ formatDate(item.info.date) }}
          </time>
          <span v-if="item.info.category && item.info.category.length" class="categories">
            {{ Array.isArray(item.info.category) ? item.info.category.join(', ') : item.info.category }}
          </span>
        </div>
        <p v-if="item.info.excerpt" class="article-excerpt">
          {{ item.info.excerpt }}
        </p>
      </article>
    </div>
    <div v-else class="no-articles">
      <p>No articles found in this {{ categoryKey === 'tag' ? 'tag' : 'category' }}.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vuepress/client'
import { useBlogCategory } from '@vuepress/plugin-blog/client'

const props = defineProps<{
  categoryKey: string
}>()

const route = useRoute()
const blogCategory = useBlogCategory(props.categoryKey)

// Extract category name from route path
const categoryName = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean)
  return pathParts[pathParts.length - 1] || ''
})

const categoryTitle = computed(() => {
  if (!categoryName.value) return props.categoryKey === 'tag' ? 'Tags' : 'Categories'
  return categoryName.value.charAt(0).toUpperCase() + categoryName.value.slice(1)
})

const categoryItems = computed(() => {
  if (!blogCategory.value.map || !categoryName.value) return []
  const category = blogCategory.value.map[categoryName.value]
  return category?.items || []
})

const formatDate = (date: any): string => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return String(date)
  }
}
</script>

<style scoped>
.category-page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.category-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--vp-c-divider);
}

.category-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.article-count {
  margin-top: 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 1rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-item {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-item h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.article-item h2 a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.article-item h2 a:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.article-excerpt {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.no-articles {
  padding: 3rem;
  text-align: center;
  color: var(--vp-c-text-2);
}
</style>
