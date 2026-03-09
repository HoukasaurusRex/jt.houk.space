<template>
  <section v-if="recommended.length" class="recommended-reads">
    <h3 class="recommended-heading">Recommended Reads</h3>
    <div class="recommended-scroll">
      <router-link
        v-for="article in recommended"
        :key="article.path"
        :to="article.path"
        class="rec-card"
      >
        <div v-if="article.info.image" class="rec-image">
          <img :src="article.info.image" :alt="article.info.title" loading="lazy" />
        </div>
        <div class="rec-body">
          <time class="rec-date">{{ formatDate(article.info.date) }}</time>
          <h4 class="rec-title">{{ article.info.title }}</h4>
          <div v-if="article.info.tag?.length" class="rec-tags">
            <span
              v-for="tag in article.info.tag"
              :key="tag"
              class="pill"
              :class="{ 'pill-matched': article.sharedTags.includes(tag) }"
            >{{ tag }}</span>
          </div>
        </div>
      </router-link>
      <router-link v-if="recommended.length < 3" to="/articles/" class="rec-card rec-fallback">
        <div class="rec-body rec-fallback-body">
          <span class="rec-fallback-text">View all articles &rarr;</span>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRecommendedArticles } from '../composables/useRecommendedArticles'

const recommended = useRecommendedArticles()

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}
</script>

<style scoped>
.recommended-reads {
  margin-top: 3rem;
}

.recommended-heading {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-color-75, #888);
  margin: 0 0 1rem;
  padding-top: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.recommended-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.5rem;

  /* Thin scrollbar matching FloatingToc */
  scrollbar-width: thin;
  scrollbar-color: var(--text-color-75) transparent;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--text-color-75);
    border-radius: 2px;
  }
}

.rec-card {
  flex: 0 0 280px;
  scroll-snap-align: start;
  text-decoration: none;
  color: inherit;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--accent-color);
  }

  &:hover .rec-title {
    color: var(--accent-color);
  }
}

@media (max-width: 640px) {
  .rec-card {
    flex: 0 0 calc(100vw - 3rem);
  }
}

.rec-image {
  aspect-ratio: 16 / 10;
  overflow: hidden;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
}

.rec-card:hover .rec-image img {
  transform: scale(1.04);
}

.rec-body {
  padding: 0.75rem;
}

.rec-date {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-color-75, #888);
  margin-bottom: 0.25rem;
}

.rec-title {
  font-family: "PT Serif", serif;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.5rem;
  transition: color 0.2s ease;
  border-bottom: none;
  padding-bottom: 0;
}

.rec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.pill {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  background: transparent;
}

.pill-matched {
  background: var(--accent-color);
  color: #fff;
}

.rec-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rec-fallback-body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 120px;
}

.rec-fallback-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-color);
  white-space: nowrap;
}
</style>
