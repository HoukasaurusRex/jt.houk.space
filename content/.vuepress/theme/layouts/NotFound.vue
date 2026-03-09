<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { RouteLink } from 'vuepress/client'
import { useLetterAnimation } from '../composables/useLetterAnimation'

const letterRefs = useTemplateRef<HTMLElement[]>('letterRefs')
const headingRef = useTemplateRef<HTMLElement>('headingRef')

const { letters } = useLetterAnimation(
  letterRefs as any,
  headingRef as any,
)
</script>

<template>
  <div class="not-found-page">
    <span
      v-for="letter in letters"
      :key="letter.id"
      ref="letterRefs"
      class="letter"
    >{{ letter.char }}</span>

    <div class="not-found-content">
      <h1 ref="headingRef" class="not-found-title">404</h1>
      <RouteLink to="/" class="not-found-home">Back to home</RouteLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: var(--background-color);
  z-index: 100;
}

.letter {
  position: absolute;
  font-family: 'PT Serif', serif;
  color: var(--text-color);
  pointer-events: none;
  will-change: transform, opacity;
  line-height: 1;
  user-select: none;
}

.not-found-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
  pointer-events: none;
}

.not-found-title {
  font-size: clamp(6rem, 15vw, 12rem);
  font-weight: 700;
  opacity: 0.1;
  color: var(--accent-color);
  font-family: 'PT Serif', serif;
  line-height: 1;
  margin: 0;
}

.not-found-home {
  color: var(--accent-color);
  margin-top: 1.5rem;
  font-size: 1rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
  pointer-events: auto;
}

.not-found-home:hover {
  text-decoration: underline;
}
</style>
