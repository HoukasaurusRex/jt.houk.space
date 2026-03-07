<template>
  <router-link class="right-arrow" :to="link">
    {{ text }} <span class="move">→</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageData } from '@vuepress/client'

const page = usePageData()

const link = computed(() =>
  (page.value.frontmatter.actionLink as string | undefined) ?? '/articles/'
)
const text = computed(() =>
  (page.value.frontmatter.actionText as string | undefined) ?? 'Articles'
)
</script>

<style scoped>
@keyframes move {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

.right-arrow {
  text-align: right;
  align-self: center;
  font-size: 1.5em;
  color: var(--text-color);
  &:hover {
    color: var(--text-color);
    .move { animation: move 1s ease-in-out infinite; }
  }
}

.move {
  position: absolute;
  top: 5px;
  padding-left: 12px;
}
</style>
