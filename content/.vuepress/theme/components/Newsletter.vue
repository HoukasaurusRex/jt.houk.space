<template>
  <div class="newsletter-placeholder">
    <p>Newsletter signup temporarily unavailable during migration</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Newsletter',
})
</script>

<style lang="scss" scoped>
.newsletter-placeholder {
  max-width: 420px;
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  margin: auto;
  padding: 30px;
  text-align: center;
  border-radius: 5px;
}
</style>
