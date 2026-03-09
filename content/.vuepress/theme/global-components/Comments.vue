<template>
  <div id="comments" class="comments-container">
    <GiscusComponent
      v-if="mounted"
      repo="HoukasaurusRex/jt.houk.space"
      repo-id="MDEwOlJlcG9zaXRvcnkxOTA3MTk5NzM="
      category="General"
      category-id="DIC_kwDOC14n5c4CyAto"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      :theme="giscusTheme"
      lang="en"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GiscusComponent from '@giscus/vue'
import { useDarkMode } from '@vuepress/theme-default/client'

const isDark = useDarkMode()
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const giscusTheme = computed(() => isDark.value ? 'dark' : 'light')
</script>

<style scoped>
.comments-container {
  margin-top: 2rem;
  padding-top: 1rem;
}
</style>
