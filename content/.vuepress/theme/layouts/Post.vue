<template>
  <Notification />
  <Layout>
    <template #page-content-top>
      <header class="post-header">
        <h1 class="post-title">{{ page.title }}</h1>
        <div v-if="author" class="post-author">{{ author }}</div>
        <div class="post-dates">
          <time v-if="date"><span class="date-label">Published</span> {{ formatDate(date) }}</time>
          <span v-if="showUpdated" class="date-sep">&middot;</span>
          <time v-if="showUpdated"><span class="date-label">Updated</span> {{ formatDate(updatedAt!) }}</time>
        </div>
        <div v-if="tags.length" class="post-tags">
          <router-link
            v-for="tag in tags"
            :key="tag"
            :to="'/tag/' + slugify(tag) + '/'"
            class="post-tag"
          >{{ tag }}</router-link>
        </div>
      </header>
    </template>
    <template #page-content-bottom>
      <div class="post-footer-components">
        <Newsletter source="jt.houk.space" />
        <Comments />
      </div>
      <FloatingToc />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageData } from '@vuepress/client'
import Layout from '@vuepress/theme-default/layouts/Layout.vue'
import Notification from '../components/Notification.vue'
import FloatingToc from '../components/FloatingToc.vue'
import Newsletter from '../global-components/Newsletter.vue'
import Comments from '../global-components/Comments.vue'

const page = usePageData()

const author = computed(() =>
  (page.value.frontmatter.author as string | undefined) || ''
)

const date = computed(() => {
  const d = page.value.frontmatter.created_at as string
  return d ? new Date(d) : null
})

const updatedAt = computed(() => {
  const d = page.value.frontmatter.updated_at as string | undefined
  return d ? new Date(d) : null
})

const showUpdated = computed(() => {
  if (!date.value || !updatedAt.value) return false
  return date.value.toDateString() !== updatedAt.value.toDateString()
})

const tags = computed(() =>
  (page.value.frontmatter.tags as string[]) || []
)

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(d)
}
</script>

<style scoped>
.post-header {
  margin-bottom: 1.5rem;
  padding-top: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.post-author {
  font-size: 0.85rem;
  color: var(--text-color-75, #888);
  margin-bottom: 0.25rem;
}

.post-title {
  font-family: "PT Serif", serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.5rem;
  padding-top: 0;
}

.post-dates {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-color-75, #888);
  margin-bottom: 0.5rem;
}

.date-label {
  font-weight: 600;
}

.date-sep {
  margin: 0 0.1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.post-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  background: transparent;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--accent-color);
    color: #fff;
  }
}

.post-footer-components {
  margin-top: 3rem;
}
</style>
