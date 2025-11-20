<template>
  <div>
    <Notification />
    <ParentLayout />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'
import Notification from '../components/Notification.vue'

export default defineComponent({
  name: 'Post',
  components: {
    ParentLayout,
    Notification,
  },
})
</script>
