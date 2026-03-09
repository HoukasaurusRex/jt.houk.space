import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'journal-unlocked'

export function useJournalUnlock() {
  const isUnlocked = ref(false)

  function applyClass() {
    document.documentElement.classList.add('journal-unlocked')
  }

  function unlock() {
    isUnlocked.value = true
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    applyClass()
  }

  onMounted(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        isUnlocked.value = true
        applyClass()
      }
    } catch {}
  })

  return { isUnlocked, unlock }
}
