<template>
  <div class="article-list">
    <div v-if="articles.length === 0" class="no-articles">
      <p>Loading articles...</p>
    </div>
    <div v-for="article in paginatedArticles" :key="article.path" class="article-item">
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

    <div v-if="totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ← Previous
      </button>
      <div class="pagination-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-number"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useSiteData } from 'vuepress/client'

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
    const site = useSiteData()
    const currentPage = ref(1)
    const itemsPerPage = 5

    const articles = computed<ArticleInfo[]>(() => {
      const allPages = (site.value as any).pages || []

      return allPages
        .filter((p: any) => {
          // Include pages in /articles/ but exclude the index page itself
          return p.path.startsWith('/articles/')
            && p.path !== '/articles/'
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

    const totalPages = computed(() => Math.ceil(articles.value.length / itemsPerPage))

    const paginatedArticles = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return articles.value.slice(start, end)
    })

    const visiblePages = computed(() => {
      const pages: number[] = []
      const total = totalPages.value
      const current = currentPage.value

      // Always show first page
      pages.push(1)

      // Show pages around current page
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      // Always show last page if there are multiple pages
      if (total > 1 && !pages.includes(total)) {
        pages.push(total)
      }

      return pages.sort((a, b) => a - b)
    })

    const goToPage = (page: number) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        // Scroll to top of article list
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

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
      paginatedArticles,
      currentPage,
      totalPages,
      visiblePages,
      goToPage,
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: var(--foreground-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  min-width: 2.5rem;
  padding: 0.5rem;
  background-color: var(--foreground-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--background-color);
    border-color: var(--accent-color);
  }

  &.active {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
}

@media (max-width: 719px) {
  .pagination {
    flex-wrap: wrap;
  }

  .pagination-btn {
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
  }

  .pagination-number {
    min-width: 2rem;
    padding: 0.375rem;
    font-size: 0.8125rem;
  }
}
</style>
