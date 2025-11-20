<template>
  <ClientOnly>
    <v-btn
      :to="link"
      class="right-arrow-btn"
      color="primary"
      variant="elevated"
      size="large"
      append-icon="mdi-arrow-right"
    >
      {{ text }}
    </v-btn>
  </ClientOnly>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { usePageFrontmatter } from 'vuepress/client'

export default defineComponent({
  name: 'RightArrow',
  props: {
    actionLink: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const frontmatter = usePageFrontmatter()

    const link = computed(() => {
      return props.actionLink || frontmatter.value.actionLink || '/articles/'
    })

    const text = computed(() => {
      return props.actionText || frontmatter.value.actionText || 'Articles'
    })

    return {
      link,
      text,
    }
  }
})
</script>

<style lang="scss" scoped>
.right-arrow-btn {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
