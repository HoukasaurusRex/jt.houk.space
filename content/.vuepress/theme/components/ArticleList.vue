<template>
  <div class="article-list">
    <div v-if="articles.length === 0" class="no-articles">
      <p>Loading articles...</p>
    </div>
    <div v-for="article in articles" :key="article.path" class="article-item">
      <h3>
        <RouterLink :to="article.path">{{ article.title }}</RouterLink>
      </h3>
      <div class="article-meta">
        <span v-if="article.date" class="article-date">
          {{ formatDate(article.date) }}
        </span>
        <span v-if="article.category" class="article-category">
          • {{ article.category }}
        </span>
      </div>
      <p v-if="article.summary" class="article-summary">
        {{ article.summary }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { usePageData, useSiteData } from 'vuepress/client'

interface ArticleInfo {
  path: string
  title: string
  date?: string
  category?: string
  summary?: string
}

export default defineComponent({
  name: 'ArticleList',
  setup() {
    const page = usePageData()
    const site = useSiteData()

    const articles = computed<ArticleInfo[]>(() => {
      const allPages = site.value.pages || []
      
      return allPages
        .filter((p: any) => {
          // Include pages in /articles/ but exclude the index page itself
          return p.path.startsWith('/articles/') 
            && p.path !== '/articles/' 
            && !p.path.includes('/dev-log/') // Exclude dev-log subdirectory
            && !p.path.endsWith('.draft.html') // Exclude drafts
            && p.title // Must have a title
        })
        .map((p: any) => ({
          path: p.path,
          title: p.title,
          date: p.frontmatter?.date,
          category: p.frontmatter?.category,
          summary: p.frontmatter?.summary || p.frontmatter?.description,
        }))
        .sort((a: ArticleInfo, b: ArticleInfo) => {
          // Sort by date, newest first
          const dateA = a.date ? new Date(a.date).getTime() : 0
          const dateB = b.date ? new Date(b.date).getTime() : 0
          return dateB - dateA
        })
    })

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return {
      articles,
      formatDate,
    }
  },
})
</script>

<style lang="scss" scoped>
.article-list {
  margin-top: 2rem;
  min-height: 200px;
}

.no-articles {
  text-align: center;
  color: var(--text-color-75);
  padding: 3rem 1rem;
}

.article-item {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    
    a {
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: var(--accent-color);
      }
    }
  }
}

.article-meta {
  font-size: 0.9rem;
  color: var(--text-color-75);
  margin-bottom: 0.75rem;
}

.article-date {
  font-weight: 500;
}

.article-category {
  text-transform: capitalize;
}

.article-summary {
  color: var(--text-color-75);
  line-height: 1.6;
  margin: 0;
}
</style>
