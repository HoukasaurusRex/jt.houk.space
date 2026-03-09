<template>
  <Layout>
    <template #page-content-top>
      <div class="articles-feed">
        <!-- Hero: first article gets the spotlight -->
        <article v-if="articles.length" class="article-hero">
          <router-link :to="articles[0].path" class="hero-link">
            <div v-if="articles[0].info.image" class="hero-image">
              <img :src="articles[0].info.image" :alt="articles[0].info.title" loading="eager" />
              <div class="hero-image-overlay"></div>
            </div>
            <div class="hero-body">
              <div class="hero-meta">
                <time>{{ formatDate(articles[0].info.date) }}</time>
                <span v-if="articles[0].info.location" class="meta-sep">&middot;</span>
                <span v-if="articles[0].info.location" class="meta-location">{{ articles[0].info.location }}</span>
              </div>
              <h2 class="hero-title">{{ articles[0].info.title }}</h2>
              <p v-if="articles[0].info.excerpt" class="hero-excerpt">{{ articles[0].info.excerpt }}</p>
            </div>
          </router-link>
          <div v-if="articles[0].info.tag?.length" class="hero-tags">
            <router-link v-for="tag in articles[0].info.tag" :key="tag" :to="'/tag/' + slugify(tag) + '/'" class="pill">{{ tag }}</router-link>
          </div>
        </article>

        <!-- Remaining articles: horizontal cards -->
        <ul class="article-list">
          <li v-for="article in articles.slice(1)" :key="article.path" class="article-card">
            <div class="card-layout">
              <router-link v-if="article.info.image" :to="article.path" class="card-image-link">
                <div class="card-image">
                  <img :src="article.info.image" :alt="article.info.title" loading="lazy" />
                </div>
              </router-link>
              <div class="card-body">
                <div class="card-meta">
                  <time>{{ formatDate(article.info.date) }}</time>
                  <span v-if="article.info.author" class="meta-sep">&middot;</span>
                  <span v-if="article.info.author">{{ article.info.author }}</span>
                  <span v-if="article.info.location" class="meta-sep">&middot;</span>
                  <span v-if="article.info.location" class="meta-location">{{ article.info.location }}</span>
                </div>
                <router-link :to="article.path" class="card-title-link">
                  <h3 class="card-title">{{ article.info.title }}</h3>
                </router-link>
                <p v-if="article.info.excerpt" class="card-excerpt">{{ article.info.excerpt }}</p>
                <div v-if="article.info.tag?.length" class="card-tags">
                  <router-link v-for="tag in article.info.tag" :key="tag" :to="'/tag/' + slugify(tag) + '/'" class="pill">{{ tag }}</router-link>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogType, useBlogCategory } from '@vuepress/plugin-blog/client'
import { useRoute, usePageFrontmatter } from 'vuepress/client'
import Layout from '@vuepress/theme-default/layouts/Layout.vue'

const route = useRoute()
const frontmatter = usePageFrontmatter()
const articlesType = useBlogType('articles')
const journalType = useBlogType('journal')
const category = useBlogCategory('tag')

const articles = computed(() => {
  if (route.path.startsWith('/tag/') && category.value.currentItems) {
    return category.value.currentItems
  }
  const key = (frontmatter.value.blogType as string) || 'articles'
  return key === 'journal' ? journalType.value.items : articlesType.value.items
})

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}
</script>

<style scoped>
.articles-feed {
  padding: 0.5rem 0 2rem;
}

/* ── Hero card ── */
.article-hero {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 2.5rem;
}

.hero-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.hero-image {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 1.25rem;
  aspect-ratio: 21 / 9;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
}

.hero-link:hover .hero-image img {
  transform: scale(1.03);
}

.hero-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.04));
  pointer-events: none;
}


.hero-meta {
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-color-75, #888);
  margin-bottom: 0.5rem;
}

.meta-sep {
  margin: 0 0.25rem;
}

.meta-location {
  font-style: italic;
  text-transform: none;
}

.hero-title {
  font-family: "PT Serif", serif;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0 0 0.6rem;
  transition: color 0.2s ease;
  border-bottom: none;
  padding-bottom: 0;
}

.hero-link:hover .hero-title {
  color: var(--accent-color);
}

.hero-excerpt {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color-75, #666);
  margin: 0;
  max-width: 38em;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.75rem;
}

/* ── Article list ── */
.article-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.article-card {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.75rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.card-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .card-layout {
    grid-template-columns: 200px 1fr;
    gap: 1.25rem;
  }
}

.card-image-link {
  text-decoration: none;
}

.card-image {
  overflow: hidden;
  border-radius: 3px;
  aspect-ratio: 16 / 10;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
}

.card-image-link:hover .card-image img {
  transform: scale(1.04);
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-meta {
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-color-75, #888);
  margin-bottom: 0.3rem;
}

.card-title-link {
  text-decoration: none;
  color: inherit;
}

.card-title {
  font-family: "PT Serif", serif;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.35rem;
  transition: color 0.2s ease;
  border-bottom: none;
  padding-bottom: 0;
}

.card-title-link:hover .card-title {
  color: var(--accent-color);
}

.card-excerpt {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--text-color-75, #666);
  margin: 0 0 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-top: auto;
}

/* ── Tag pills (individually clickable) ── */
.pill {
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
</style>
