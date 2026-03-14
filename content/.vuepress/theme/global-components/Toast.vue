<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        ref="toastRef"
        class="toast"
        :class="'toast--' + type"
        role="alert"
        tabindex="-1"
        @click="dismiss"
        @keydown.escape="dismiss"
      >
        <span class="toast-message">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const toastRef = ref<HTMLElement | null>(null)

const props = withDefaults(
  defineProps<{
    message: string
    type?: 'error' | 'success' | 'info'
    duration?: number
  }>(),
  {
    type: 'info',
    duration: 5000,
  },
)

const emit = defineEmits<{ dismiss: [] }>()

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function dismiss() {
  visible.value = false
  if (timer) clearTimeout(timer)
  emit('dismiss')
}

onMounted(() => {
  visible.value = true
  nextTick(() => toastRef.value?.focus())
  if (props.duration > 0) {
    timer = setTimeout(dismiss, props.duration)
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  max-width: 90vw;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: var(--foreground-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.toast--error {
  border-color: var(--red);
}

.toast--success {
  border-color: var(--green);
}

.toast--info {
  border-color: var(--accent-color);
}

.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(0.5rem);
}
</style>
