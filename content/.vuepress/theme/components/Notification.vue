<template>
  <div
    v-show="notification && !notificationIsClosed"
    class="notification-alert"
  >
    <a
      :href="notification.link"
      target="_blank"
      rel="noopener noreferrer"
      class="notification-link"
    >
      <div class="notification-content">
        <div class="notification-title" v-if="notification.title">
          {{ notification.title }}
        </div>
        <div class="notification-description">
          {{ notification.description }}
        </div>
      </div>
    </a>
    <button
      @click="() => closeNotification(notification.id)"
      class="notification-close"
      aria-label="Close notification"
    >
      ×
    </button>
  </div>
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
  padding: 0.3rem;
  background: var(--text-color);
  color: var(--background-color);
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.15);
  }
}

.notification-link {
  display: flex;
  align-items: center;
  color: var(--background-color);
  text-decoration: none;

  &:hover {
    color: var(--background-color);
  }
}

.notification-content {
  max-width: 600px;
  margin: 0 1rem;
}

.notification-title {
  font-weight: bold;
  margin-right: 0.5rem;
}

.notification-description {
  display: none;
}

.notification-close {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  color: var(--background-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;

  &:hover {
    opacity: 0.8;
  }
}

@media (min-width: 720px) {
  .notification-alert {
    top: 80px;
  }

  .notification-description {
    display: block;
  }
}

@media (min-width: 1300px) {
  .notification-alert {
    margin-right: 230px;
    border-radius: 0 0 5px 0;
  }
}
</style>
