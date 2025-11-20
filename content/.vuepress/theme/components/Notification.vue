<template>
  <v-alert
    v-if="notification && !notificationIsClosed"
    :href="notification.link"
    target="_blank"
    rel="noopener noreferrer"
    color="primary"
    variant="elevated"
    closable
    @click:close="closeNotification(notification.id)"
    class="notification-alert"
  >
    <template v-slot:title v-if="notification.title">
      {{ notification.title }}
    </template>
    <template v-slot:text>
      {{ notification.description }}
    </template>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useThemeData } from '@vuepress/plugin-theme-data/client'

interface Notification {
  id: string
  title?: string
  description: string
  link: string
}

export default defineComponent({
  name: 'Notification',
  setup() {
    const themeData = useThemeData()
    const notificationIsClosed = ref(false)

    const notification = computed(() => {
      return (themeData.value.notification as Notification) || null
    })

    const shouldHideNotification = (id: string): boolean => {
      if (typeof window === 'undefined') return false
      const stored = localStorage.getItem(id)
      return !!stored && JSON.parse(stored).isClosed
    }

    const closeNotification = (id: string) => {
      notificationIsClosed.value = true
      localStorage.setItem(id, JSON.stringify({ isClosed: true }))
    }

    if (notification.value) {
      notificationIsClosed.value = shouldHideNotification(notification.value.id)
    }

    return {
      notification,
      notificationIsClosed,
      closeNotification,
    }
  },
})
</script>

<style lang="scss" scoped>
.notification-alert {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  border-radius: 0;
  z-index: 100;

  @media (min-width: 720px) {
    top: 80px;
  }

  @media (min-width: 1300px) {
    margin-right: 230px;
    border-radius: 0 0 5px 0;
  }
}
</style>
