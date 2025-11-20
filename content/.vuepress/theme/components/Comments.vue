<template>
  <ClientOnly>
    <v-sheet class="comments-wrapper" rounded>
      <v-alert type="info" variant="tonal">
        Comments are now powered by GitHub Discussions via Giscus.
        They will appear below when the page loads.
      </v-alert>
    </v-sheet>
  </ClientOnly>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Comments',
})
</script>

<style lang="scss" scoped>
.comments-wrapper {
  margin: 2rem 0;
  padding: 1rem;
}
</style>
