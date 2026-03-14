<template>
  <form
    ref="wrapperRef"
    class="newsletter"
    :class="{ 'newsletter--visible': isVisible }"
    :aria-busy="loading"
    @submit.prevent="onSubmit"
  >
    <div class="newsletter-shine" aria-hidden="true"></div>
    <label for="newsletter-email" class="newsletter-label">Email newsletter</label>
    <input
      id="newsletter-email"
      v-model="mail"
      type="email"
      name="email"
      placeholder="Email"
      inputmode="email"
      autocomplete="email"
      autocapitalize="off"
      autocorrect="off"
      required
      data-cy="email"
      class="newsletter-input"
      :disabled="submitted"
      :aria-invalid="mail.length > 0 && !isValidEmail ? true : undefined"
      aria-describedby="newsletter-status"
    />
    <button
      ref="btnRef"
      type="submit"
      data-cy="submit"
      class="newsletter-btn"
      :class="{ 'newsletter-btn--typing': isTyping }"
      :disabled="submitted || loading || !isValidEmail"
    >
      <span class="btn-label">{{ buttonLabel }}</span>
    </button>
    <div id="newsletter-status" aria-live="polite" class="sr-only">
      {{ statusAnnouncement }}
    </div>
    <transition name="subtext-slide" mode="out-in">
      <span v-if="slowSubtext" :key="slowSubtext" class="newsletter-subtext">
        {{ slowSubtext }}
      </span>
    </transition>
    <Toast
      v-if="errorMsg"
      :message="errorMsg"
      type="error"
      :duration="5000"
      @dismiss="errorMsg = ''"
    />
    <ClientOnly>
      <Teleport to="body">
        <div v-if="showRipple" class="ink-ripple-container" aria-hidden="true">
          <div ref="ripple1Ref" class="ink-ripple" />
          <div ref="ripple2Ref" class="ink-ripple" />
        </div>
      </Teleport>
    </ClientOnly>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { gsap as GsapType } from 'gsap'
import Toast from './Toast.vue'

let gsap: typeof GsapType
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

const SUBSCRIBE_URL = '/api/subscribe'
const STORAGE_KEY = 'newsletter-subscribed'

const ERROR_MESSAGES = [
  'Well that sucks',
  'My bad, maybe try again?',
  'Dang elves again',
  'I think there\'s a house elf messing with the server. Let me get the elf stick.',
  'Dang',
]

const SLOW_MESSAGES = [
  'Bear with me here',
  'The mailserver is sleeping, give her some time to wake up',
  "I don't pay very much for her so maybe give her a couple seconds",
  'Let me knock on the door to see if she\'s awake',
  "You know what, I got your message - I'll try delivering it myself when she's up",
]

const SLOW_INTERVAL_MS = 6000
// 3s initial delay + 4 messages × 6s each = 27s before we give up
const SLOW_TIMEOUT_MS = 3000 + SLOW_MESSAGES.length * SLOW_INTERVAL_MS

const randomErrorMessage = (): string =>
  ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]

const props = withDefaults(defineProps<{ source?: string }>(), {
  source: '',
})

const wrapperRef = ref<HTMLFormElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)
const ripple1Ref = ref<HTMLElement | null>(null)
const ripple2Ref = ref<HTMLElement | null>(null)

const mail = ref('')
const loading = ref(false)
const submitted = ref(false)
const errorMsg = ref('')
const previouslySubscribed = ref(false)
const isVisible = ref(false)
const isTyping = ref(false)
const showRipple = ref(false)

const buttonLabel = ref('Subscribe')
const slowSubtext = ref('')

const validationInput = typeof document !== 'undefined'
  ? Object.assign(document.createElement('input'), { type: 'email' })
  : null

const isValidEmail = computed(() => {
  if (!validationInput) return false
  validationInput.value = mail.value
  return mail.value.length > 0 && validationInput.checkValidity()
})

const statusAnnouncement = computed(() => {
  if (loading.value) return 'Subscribing, please wait.'
  if (submitted.value) return buttonLabel.value
  if (errorMsg.value) return errorMsg.value
  return ''
})

let observer: IntersectionObserver | null = null
let typingTimeline: gsap.core.Timeline | null = null
let slowTimer: ReturnType<typeof setTimeout> | null = null
let slowIndex = 0

const getDefaultLabel = (): string =>
  previouslySubscribed.value ? 'Subscribe... again?' : 'Subscribe'

const setupObserver = () => {
  if (!wrapperRef.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry.isIntersecting
    },
    { threshold: 1.0 },
  )
  observer.observe(wrapperRef.value)
}

const runTypewriterAnimation = () => {
  if (prefersReducedMotion) {
    buttonLabel.value = 'Subscribing...'
    return
  }
  isTyping.value = true

  const tl = gsap.timeline()
  typingTimeline = tl

  // Keystroke sequence with natural variance
  const keystrokes: [string, number][] = [
    ['Subscrib', 0],          // delete "e" immediately
    ['Subscribi', 0.12],      // type "i"
    ['Subscribin', 0.14],     // type "n"
    ['Subscribing', 0.11],    // type "g"
    ['Subscribing.', 0.3],    // pause before dots (slower)
    ['Subscribing..', 0.35],  // second dot
    ['Subscribing...', 0.4],  // third dot
  ]

  let t = 0
  for (const [text, delay] of keystrokes) {
    t += delay
    tl.call(() => { buttonLabel.value = text }, [], t)
  }

  // After initial sequence, loop all three dots
  tl.call(() => {
    const dotLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.3 })
    typingTimeline = dotLoop
    dotLoop.call(() => { buttonLabel.value = 'Subscribing.' }, [], 0)
    dotLoop.call(() => { buttonLabel.value = 'Subscribing..' }, [], 0.35)
    dotLoop.call(() => { buttonLabel.value = 'Subscribing...' }, [], 0.7)
  }, [], t + 0.5)
}

const startSlowSubtext = () => {
  slowIndex = 0
  slowSubtext.value = ''
  const showNext = () => {
    if (slowIndex >= SLOW_MESSAGES.length) return
    slowSubtext.value = SLOW_MESSAGES[slowIndex]
    slowIndex++
    slowTimer = setTimeout(showNext, SLOW_INTERVAL_MS)
  }
  slowTimer = setTimeout(showNext, 3000)
}

const stopSlowSubtext = () => {
  if (slowTimer) {
    clearTimeout(slowTimer)
    slowTimer = null
  }
  slowSubtext.value = ''
  slowIndex = 0
}

const resetTypewriter = () => {
  if (typingTimeline) {
    typingTimeline.kill()
    typingTimeline = null
  }
  isTyping.value = false
}

const playSuccessAnimation = () => {
  if (prefersReducedMotion || !wrapperRef.value) return
  const el = wrapperRef.value

  const tl = gsap.timeline()

  // 1. Border flash bright
  tl.to(el, {
    boxShadow: '0 0 30px hsla(327,76%,64%,0.5), 0 0 60px hsla(327,76%,64%,0.25)',
    borderColor: 'hsla(327,76%,64%,0.8)',
    duration: 0.3,
    ease: 'power2.out',
  })

  // 2. Pop bounce
  tl.to(el, {
    scale: 1.03,
    duration: 0.2,
    ease: 'back.out(3)',
  }, '-=0.1')

  tl.to(el, {
    scale: 1,
    duration: 0.4,
    ease: 'elastic.out(1, 0.4)',
  })

  // 3. Hold intense glow briefly then settle to warm persistent state
  tl.to(el, {
    boxShadow: '0 0 25px hsla(327,76%,64%,0.35), 0 0 50px hsla(327,76%,64%,0.15)',
    borderColor: 'hsla(327,76%,64%,0.5)',
    duration: 0.6,
    ease: 'power1.out',
  }, '-=0.2')

  tl.to(el, {
    boxShadow: '0 0 12px hsla(327,76%,64%,0.1)',
    borderColor: 'hsla(327,76%,64%,0.2)',
    duration: 1.2,
    ease: 'power2.out',
  })

  // 4. Trigger ink ripple mid-sequence
  tl.call(() => playInkRipple(), [], '-=0.6')
}

const playInkRipple = () => {
  if (!btnRef.value) return
  const rect = btnRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  // Size to cover viewport from the button position
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxDist = Math.sqrt(
    Math.max(cx, vw - cx) ** 2 + Math.max(cy, vh - cy) ** 2,
  )
  const diameter = maxDist * 2.5

  showRipple.value = true

  nextTick(() => {
    const ripples = [ripple1Ref.value, ripple2Ref.value].filter(Boolean) as HTMLElement[]
    ripples.forEach((r) => {
      r.style.width = `${diameter}px`
      r.style.height = `${diameter}px`
      r.style.left = `${cx - diameter / 2}px`
      r.style.top = `${cy - diameter / 2}px`
    })

    gsap.set(ripples, { scale: 0, opacity: 0 })

    const tl = gsap.timeline({
      onComplete: () => { showRipple.value = false },
    })

    // Circle 1
    tl.to(ripples[0], {
      scale: 1,
      opacity: 0.1,
      duration: 0.6,
      ease: 'power2.out',
    })
    tl.to(ripples[0], {
      opacity: 0,
      duration: 1.2,
      ease: 'power1.out',
    }, '-=0.4')

    // Circle 2 (delayed)
    if (ripples[1]) {
      tl.to(ripples[1], {
        scale: 1,
        opacity: 0.06,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.3)
      tl.to(ripples[1], {
        opacity: 0,
        duration: 1.2,
        ease: 'power1.out',
      }, 0.7)
    }
  })
}

const onSubmit = async () => {
  if (loading.value || submitted.value) return
  if (!isValidEmail.value) {
    errorMsg.value = mail.value.length === 0
      ? 'Please enter your email address'
      : 'That doesn\'t look like a valid email'
    return
  }
  errorMsg.value = ''
  loading.value = true

  runTypewriterAnimation()
  startSlowSubtext()

  try {

    const controller = new AbortController()
    const abortTimer = setTimeout(() => controller.abort(), SLOW_TIMEOUT_MS)
    const params: Record<string, string> = { email: mail.value }
    if (props.source) params.source = props.source
    const body = new URLSearchParams(params)
    const res = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal,
    })
    clearTimeout(abortTimer)

    if (!res.ok) {
      throw new Error(`Subscribe failed: ${res.status}`)
    }

    const data = await res.json().catch(() => ({}))

    submitted.value = true
    mail.value = ''

    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
    previouslySubscribed.value = true

    resetTypewriter()
    buttonLabel.value = data.already_subscribed ? 'Already subscribed!' : 'Subscribed!'

    playSuccessAnimation()
  } catch (error) {
    console.error(error)
    resetTypewriter()
    buttonLabel.value = getDefaultLabel()
    errorMsg.value = randomErrorMessage()
  } finally {
    loading.value = false
    stopSlowSubtext()
  }
}

// --- Lifecycle ---
onMounted(async () => {
  gsap = (await import('gsap')).default
  try {
    previouslySubscribed.value = localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {}
  buttonLabel.value = getDefaultLabel()
  setupObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  resetTypewriter()
  stopSlowSubtext()
})
</script>

<style scoped>
.newsletter {
  position: relative;
  max-width: 420px;
  background-color: var(--background-color);
  color: var(--text-color);
  margin: auto;
  padding: 30px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  transition: box-shadow 0.6s ease, border-color 0.6s ease;
  will-change: transform;
  transform-origin: center;
  overflow: hidden;
}

.newsletter--visible {
  box-shadow: 0 0 20px hsla(327, 76%, 64%, 0.15);
  border-color: hsla(327, 76%, 64%, 0.3);
}

/* Shine sweep along the border */
.newsletter-shine {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 2px solid transparent;
    background: linear-gradient(
      90deg,
      transparent 0%,
      hsla(327, 76%, 64%, 0.7) 50%,
      transparent 100%
    ) border-box;
    mask:
      linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    animation: shine-sweep 4s ease-in-out infinite;
  }
}

@keyframes shine-sweep {
  0% { transform: translateX(-100%); opacity: 1; }
  20% { transform: translateX(100%); opacity: 1; }
  21% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(-100%); opacity: 0; }
}

.newsletter-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-color-75, #888);
  margin-bottom: 0.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.newsletter-input {
  display: block;
  width: 100%;
  max-width: 400px;
  height: 40px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background-color: var(--foreground-color);
  color: var(--text-color);
  font-size: 1rem;

  &:disabled {
    opacity: 0.6;
  }
}

.newsletter-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: var(--accent-color);
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: var(--text-color-75, #888);
  }
}

/* Blinking cursor during typewriter phase */
.newsletter-btn--typing .btn-label::after {
  content: '|';
  animation: cursor-blink 0.8s step-end infinite;
  margin-left: 1px;
  font-weight: 400;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Slow-loading subtext */
.newsletter-subtext {
  display: block;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  color: var(--text-color-75, hsla(180, 33%, 10%, 0.75));
  text-align: center;
  margin-top: 10px;
  line-height: 1.3;
}

.subtext-slide-enter-active {
  transition: all 0.3s ease-out;
}
.subtext-slide-leave-active {
  transition: all 0.2s ease-in;
}
.subtext-slide-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.subtext-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* Ink ripple */
.ink-ripple-container {
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  overflow: hidden;
}

.ink-ripple {
  position: absolute;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0;
  will-change: transform, opacity;
}

.newsletter-input:focus-visible,
.newsletter-btn:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Dark mode glow boost */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) .newsletter--visible {
    box-shadow: 0 0 20px hsla(327, 76%, 64%, 0.25);
  }
}

[data-theme='dark'] .newsletter--visible {
  box-shadow: 0 0 20px hsla(327, 76%, 64%, 0.25);
}
</style>
