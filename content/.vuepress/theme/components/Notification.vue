<template>
  <div
    v-show="!isClosed"
    class="alert"
    role="alert"
    @keydown.escape="close"
  >
    <a
      :href="notification.link"
      target="_blank"
      rel="noopener noreferrer"
      class="alert-link"
    >
      <svg
        class="alert-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M163.9 136.9c-29.4-29.8-29.4-78.2 0-108s77-29.8 106.4 0l17.7 18 17.7-18c29.4-29.8 77-29.8 106.4 0s29.4 78.2 0 108L310.5 240.1c-6.2 6.3-14.3 9.4-22.5 9.4s-16.3-3.1-22.5-9.4L163.9 136.9zM568.2 336.3c13.1 17.8 9.3 42.8-8.5 55.9L433.1 485.5c-23.4 17.2-51.6 26.5-80.7 26.5L192 512 32 512c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l36.8 0 44.9-36c22.7-18.2 50.9-28 80-28l78.3 0 16 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l120.6 0 119.7-88.2c17.8-13.1 42.8-9.3 55.9 8.5zM193.6 384c0 0 0 0 0 0l-.9 0c.3 0 .6 0 .9 0z"/>
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
    // SSR / private browsing
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

<style scoped>
.alert {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem 1rem;
  font-size: 0.75rem;
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
  gap: 0.5rem;
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
  margin: 0 0.75rem;
}

.alert-title {
  display: block;
  font-weight: 700;
  margin-bottom: 0.1rem;
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
  font-size: 0.85rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
}

@media (min-width: 720px) {
  .description {
    display: block;
  }
}

@media (min-width: 1300px) {
  .alert {
    margin-right: 230px;
    border-radius: 0 0 5px 0;
  }
}
</style>
