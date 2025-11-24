<template>
  <div class="blog-category-page">
    <Notification />
    <div class="page-container">
      <div class="category-header">
        <nav class="breadcrumb">
          <RouterLink to="/articles/">Articles</RouterLink>
          <span class="separator">/</span>
          <span class="current">{{ categoryName }}</span>
        </nav>
        <h1>{{ pageTitle }}</h1>
        <p v-if="categoryDescription" class="category-description">
          {{ categoryDescription }}
        </p>
        <div v-if="articleCount" class="article-count">
          {{ articleCount }} {{ articleCount === 1 ? 'article' : 'articles' }}
        </div>
      </div>

      <div v-if="articles.length > 0" class="article-list">
        <article
          v-for="article in articles"
          :key="article.path"
          class="article-item"
        >
          <h2 class="article-title">
            <RouterLink :to="article.path">{{ article.title }}</RouterLink>
          </h2>
          <div class="article-meta">
            <span v-if="article.date" class="article-date">
              {{ formatDate(article.date) }}
            </span>
            <span v-if="article.category" class="article-category">
              • {{ article.category }}
            </span>
          </div>
          <p v-if="article.excerpt" class="article-excerpt">
            {{ article.excerpt }}
          </p>
          <div v-if="article.tags && article.tags.length > 0" class="article-tags">
            <RouterLink
              v-for="tag in article.tags"
              :key="tag"
              :to="`/tag/${tag}/`"
              class="tag-link"
            >
              {{ tag }}
            </RouterLink>
          </div>
        </article>
      </div>

      <div v-else class="no-articles">
        <p>No articles found in this {{ categoryType }}.</p>
        <RouterLink to="/articles/" class="back-link">
          ← Back to all articles
        </RouterLink>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { usePageData, usePageFrontmatter, useRouteLocale } from 'vuepress/client'
import { useBlogCategory } from '@vuepress/plugin-blog/client'
import Notification from '../components/Notification.vue'
import Footer from '../components/Footer.vue'

interface ArticleInfo {
  path: string
  title: string
  date?: string
  category?: string
  excerpt?: string
  tags?: string[]
}

export default defineComponent({
  name: 'BlogCategory',
  components: {
    Notification,
    Footer,
  },
  setup() {
    const page = usePageData()
    const frontmatter = usePageFrontmatter()
    const routeLocale = useRouteLocale()

    // Determine if this is a category or tag page based on the URL
    const categoryType = computed(() => {
      if (page.value.path.includes('/category/')) return 'category'
      if (page.value.path.includes('/tag/')) return 'tag'
      return 'category'
    })

    // Get the appropriate blog category based on type
    const categoryKey = computed(() => categoryType.value)
    const blogCategory = useBlogCategory(categoryKey.value, routeLocale.value)

    // Extract category name from the current page's category map
    const categoryName = computed(() => {
      const pathParts = page.value.path.split('/').filter(Boolean)
      return pathParts[pathParts.length - 1] || ''
    })

    // Get the current category's items
    const currentCategory = computed(() => {
      if (!blogCategory.value.map || !categoryName.value) return null
      return blogCategory.value.map[categoryName.value]
    })

    // Convert to article info array
    const articles = computed<ArticleInfo[]>(() => {
      if (!currentCategory.value || !currentCategory.value.items) return []

      return currentCategory.value.items.map((item) => ({
        path: item.path,
        title: item.info?.title || '',
        date: item.info?.date || undefined,
        category: Array.isArray(item.info?.category)
          ? item.info.category[0]
          : item.info?.category,
        excerpt: item.info?.excerpt || '',
        tags: Array.isArray(item.info?.tag) ? item.info.tag : [],
      }))
    })

    const pageTitle = computed(() => {
      return frontmatter.value.title ||
        `${categoryType.value === 'tag' ? 'Tag' : 'Category'}: ${categoryName.value}`
    })

    const categoryDescription = computed(() => {
      return frontmatter.value.description || ''
    })

    const articleCount = computed(() => {
      return articles.value.length
    })

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return {
      articles,
      pageTitle,
      categoryName,
      categoryDescription,
      categoryType,
      articleCount,
      formatDate,
    }
  },
})
</script>

<style lang="scss" scoped>
.blog-category-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-container {
  flex: 1;
  max-width: 740px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
}

.category-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.breadcrumb {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: var(--text-color-75);

  a {
    color: var(--accent-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .separator {
    margin: 0 0.5rem;
  }

  .current {
    font-weight: 600;
    color: var(--text-color);
  }
}

h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  color: var(--text-color);
  text-transform: capitalize;
}

.category-description {
  margin: 0.5rem 0;
  font-size: 1.125rem;
  color: var(--text-color-75);
}

.article-count {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: var(--text-color-75);
  font-weight: 500;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.article-item {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }
}

.article-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;

  a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--accent-color);
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

.article-excerpt {
  color: var(--text-color-75);
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-link {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--background-color);
  color: var(--text-color);
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
}

.no-articles {
  text-align: center;
  padding: 3rem 1rem;

  p {
    font-size: 1.125rem;
    color: var(--text-color-75);
    margin-bottom: 1.5rem;
  }
}

.back-link {
  display: inline-block;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 719px) {
  h1 {
    font-size: 2rem;
  }

  .article-title {
    font-size: 1.5rem;
  }
}
</style>
