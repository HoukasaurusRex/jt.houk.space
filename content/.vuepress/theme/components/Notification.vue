<template>
  <div
    v-show="!isClosed"
    class="alert"
    role="alert"
  >
    <a
      :href="notification.link"
      target="_blank"
      rel="noopener noreferrer"
      class="alert-link"
    >
      <!-- Heart icon (inline SVG — replaces FontAwesome faHandHoldingHeart) -->
      <svg
        class="alert-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M163.9 136.9c-29.4-29.8-29.4-78.2 0-108s77-29.8 106.4 0l17.7 18 17.7-18c29.4-29.8 77-29.8 106.4 0 29.4 29.8 29.4 78.2 0 108L310.5 240.1c-6.2 6.3-14.3 9.4-22.5 9.4s-16.3-3.1-22.5-9.4L163.9 136.9zM568 336c13.3 0 24 10.7 24 24s-10.7 24-24 24H441.9c-3.4 26.4-25.8 47.2-53.6 47.2l-48 0c-27.6 0-50-20.9-53.4-47.4L152.1 384H24c-13.3 0-24-10.7-24-24s10.7-24 24-24H152l0-24c0-30.9 25.1-56 56-56l240 0c30.9 0 56 25.1 56 56l0 24H568z"/>
      </svg>
      <div class="alert-body">
        <strong v-if="notification.title" class="alert-title">{{ notification.title }}</strong>
        <span class="description">{{ notification.description }}</span>
      </div>
    </a>
    <button
      class="alert-close"
      aria-label="Dismiss notification"
      @click="close"
    >✕</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Notification data — configurable here until a proper config API is wired up
const notification = {
  id: 'irc-donate-gaza',
  title: 'Help families in Gaza',
  description: 'Donate to the IRC to provide humanitarian aid and resettlement resources to families in Gaza',
  link: 'https://help.rescue.org/donate',
}

const isClosed = ref(false)

onMounted(() => {
  try {
    const stored = localStorage.getItem(notification.id)
    if (stored && JSON.parse(stored).isClosed) {
      isClosed.value = true
    }
  } catch {
    // SSR / private browsing — ignore
  }
})

function close() {
  isClosed.value = true
  try {
    localStorage.setItem(notification.id, JSON.stringify({ isClosed: true }))
  } catch {
    // ignore
  }
}
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  top: 3.6rem;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 1rem;
  background: var(--text-color);
  color: var(--background-color);
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.15);
  }
}

.alert-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: inherit;
  text-decoration: none;
}

.alert-icon {
  width: 30px;
  height: 30px;
  min-width: 30px;
  flex-shrink: 0;
}

.alert-body {
  max-width: 600px;
  margin: 0 1rem;
}

.alert-title {
  margin-right: 0.5rem;
}

.description {
  display: none;
}

.alert-close {
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
}

@media (min-width: 720px) {
  .alert {
    top: 3.8rem;
  }
  .description {
    display: inline;
  }
}

@media (min-width: 1300px) {
  .alert {
    margin-right: 230px;
    border-radius: 0 0 5px 0;
  }
}
</style>
