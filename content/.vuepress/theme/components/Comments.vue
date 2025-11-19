<template>
  <div class="comments-placeholder">
    <p>Comments temporarily unavailable during migration</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Comments',
})
</script>

<style lang="scss" scoped>
.comments-placeholder {
  padding: 2rem;
  text-align: center;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  margin: 2rem 0;
}
</style>
