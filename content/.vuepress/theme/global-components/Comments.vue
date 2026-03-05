<template>
  <!-- #disqus_thread id preserved for Cypress test compatibility -->
  <div id="disqus_thread" class="comments-container">
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
import { useColorMode } from '../composables/useColorMode'

const { mode } = useColorMode()
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const giscusTheme = computed(() => mode.value === 'dark' ? 'dark' : 'light')
</script>

<style lang="scss" scoped>
.comments-container {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>
