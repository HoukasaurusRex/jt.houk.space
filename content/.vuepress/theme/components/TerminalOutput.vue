<template>
  <transition name="terminal-slide">
    <div v-if="result && result.segments.length" class="terminal-output">
      <span
        v-for="(seg, i) in result.segments"
        :key="i"
        :class="'terminal-' + seg.style"
      >{{ seg.text }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import type { CommandResult } from '../composables/useTerminal'

defineProps<{
  result: CommandResult | null
}>()
</script>

<style scoped>
.terminal-output {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  text-align: center;
  margin: 0.5rem auto 0;
  overflow: hidden;
}

.terminal-error { color: var(--red); }
.terminal-success { color: var(--green); }
.terminal-string { color: var(--yellow); }
.terminal-info { color: var(--text-color); }

.terminal-slide-enter-active {
  transition: all 0.3s ease-out;
}
.terminal-slide-leave-active {
  transition: all 0.2s ease-in;
}
.terminal-slide-enter-from,
.terminal-slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
.terminal-slide-enter-to,
.terminal-slide-leave-from {
  opacity: 1;
  max-height: 3rem;
  transform: translateY(0);
}
</style>
