<template>
  <!-- Giscus will replace this container in issue #89.
       The #disqus_thread id is preserved for Cypress test compatibility
       during the transition period. -->
  <div id="disqus_thread" class="comments-container">
    <p class="comments-placeholder">Comments coming soon.</p>
  </div>
</template>

<script setup lang="ts">
// Comments component — currently a placeholder.
// Giscus (GitHub Discussions web component) integration: issue #89
</script>

<style lang="scss" scoped>
.comments-container {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.comments-placeholder {
  color: var(--text-color);
  opacity: 0.5;
  font-style: italic;
}
</style>
