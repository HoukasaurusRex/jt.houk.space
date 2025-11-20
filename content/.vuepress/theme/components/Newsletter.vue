<template>
  <ClientOnly>
    <v-card class="newsletter-card" elevation="2">
      <v-card-title>
        <v-icon left color="primary">mdi-email-newsletter</v-icon>
        Newsletter
      </v-card-title>
      <v-card-text>
        <v-alert type="info" variant="tonal" class="mb-4">
          Newsletter signup coming soon! Subscribe to get updates on new articles and projects.
        </v-alert>
        <v-text-field
          label="Email Address"
          type="email"
          variant="outlined"
          prepend-inner-icon="mdi-email"
          disabled
          hint="Newsletter integration in progress"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="elevated" disabled block>
          Subscribe
        </v-btn>
      </v-card-actions>
    </v-card>
  </ClientOnly>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Newsletter',
})
</script>

<style lang="scss" scoped>
.newsletter-card {
  max-width: 420px;
  margin: 2rem auto;
}
</style>
