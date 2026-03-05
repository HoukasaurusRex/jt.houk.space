import { ref, watch } from 'vue'

type ColorMode = 'light' | 'dark'

const mode = ref<ColorMode>(
  (typeof localStorage !== 'undefined' ? localStorage.getItem('color-mode') as ColorMode | null : null)
  ?? (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
)

watch(mode, (val) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', val === 'dark')
  localStorage.setItem('color-mode', val)
}, { immediate: true })

export function useColorMode() {
  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }
  return { mode, toggle }
}
