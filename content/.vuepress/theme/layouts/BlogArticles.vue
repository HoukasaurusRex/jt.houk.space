<template>
  <Layout>
    <template #page-content-top>
      <ul class="article-list">
        <li v-for="article in type.items" :key="article.path" class="article-card">
          <router-link :to="article.path">
            <h2 class="article-title">{{ article.info.title }}</h2>
            <div class="article-meta">
              <time v-if="article.info.date">{{ formatDate(article.info.date) }}</time>
              <span v-for="tag in article.info.tag" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p v-if="article.info.excerpt" class="article-excerpt">{{ article.info.excerpt }}</p>
          </router-link>
        </li>
      </ul>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { useBlogType } from '@vuepress/plugin-blog/client'
import Layout from '@vuepress/theme-default/layouts/Layout.vue'

const type = useBlogType('articles')

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}
</script>

<style lang="scss" scoped>
.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-card {
  border-bottom: 1px solid var(--border-color);
  padding: 1.5rem 0;

  &:last-child {
    border-bottom: none;
  }

  a {
    display: block;
    text-decoration: none;
    color: inherit;

    &:hover .article-title {
      color: var(--accent-color);
    }
  }
}

.article-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  transition: color 0.1s ease;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-color-light, #888);
  margin-bottom: 0.5rem;
}

.tag {
  background-color: var(--accent-color);
  color: #fff;
  border-radius: 3px;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
}

.article-excerpt {
  margin: 0;
  color: var(--text-color-light, #666);
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
