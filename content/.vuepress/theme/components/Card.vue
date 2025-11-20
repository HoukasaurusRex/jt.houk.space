<template>
  <ClientOnly>
    <v-card 
      :to="url"
      class="project-card"
      elevation="2"
      hover
    >
      <v-img
        :src="imageUrl"
        :alt="name"
        height="200"
        cover
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey-lighten-5" />
          </v-row>
        </template>
      </v-img>
      
      <v-card-title class="card-title">
        {{ name }}
      </v-card-title>
    </v-card>
  </ClientOnly>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',
  props: {
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: 'https://jt.houk.space/logo.png'
    }
  },
})
</script>

<style lang="scss" scoped>
.project-card {
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  .card-title {
    color: var(--text-color);
    transition: color 0.2s ease-in-out;
  }
  
  &:hover .card-title {
    color: var(--accent-color);
  }
}
</style>
