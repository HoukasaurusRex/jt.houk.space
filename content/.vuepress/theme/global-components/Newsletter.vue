<template>
  <div ref="wrapperRef" class="newsletter" :class="{ 'newsletter--visible': isVisible }">
    <div class="newsletter-shine"></div>
    <input
      v-model="mail"
      type="email"
      name="email"
      aria-label="Email"
      placeholder="Email"
      autocapitalize="off"
      autocorrect="off"
      data-cy="email"
      class="newsletter-input"
      :disabled="submitted"
      @keydown.enter="onSubmit"
    />
    <button
      ref="btnRef"
      type="submit"
      data-cy="submit"
      class="newsletter-btn"
      :class="{ 'newsletter-btn--typing': isTyping }"
      :disabled="submitted || loading"
      @click.prevent="onSubmit"
    >
      <span class="btn-label">{{ buttonLabel }}</span>
    </button>
    <Toast
      v-if="errorMsg"
      :message="errorMsg"
      type="error"
      :duration="5000"
      @dismiss="errorMsg = ''"
    />
    <ClientOnly>
      <Teleport to="body">
        <div v-if="showRipple" class="ink-ripple-container">
          <div ref="ripple1Ref" class="ink-ripple" />
          <div ref="ripple2Ref" class="ink-ripple" />
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { gsap as GsapType } from 'gsap'
import Toast from './Toast.vue'

let gsap: typeof GsapType

const SUBSCRIBE_URL = '/api/subscribe'
const STORAGE_KEY = 'newsletter-subscribed'
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i

const ERROR_MESSAGES = [
  "Well, that didn't work. Mind trying again?",
  'Something went sideways. Give it another shot?',
  'The internet gremlins struck. One more try?',
  "Hmm, that didn't land. Try again in a sec?",
  'Subscription hiccup. Shall we try once more?',
]

function randomErrorMessage(): string {
  return ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]
}

const props = withDefaults(defineProps<{ source?: string }>(), {
  source: '',
})

const wrapperRef = ref<HTMLElement | null>(null)
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

const isValidEmail = computed(() => emailRegex.test(mail.value))

let observer: IntersectionObserver | null = null
let typingTimeline: gsap.core.Timeline | null = null

// Compute default button label
function getDefaultLabel(): string {
  if (previouslySubscribed.value) return 'Subscribe... again?'
  return 'Subscribe'
}

// --- IntersectionObserver for border glow ---
function setupObserver() {
  if (!wrapperRef.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      isVisible.value = entry.isIntersecting
    },
    { threshold: 1.0 },
  )
  observer.observe(wrapperRef.value)
}

// --- Typewriter loading animation ---
function runTypewriterAnimation() {
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

function resetTypewriter() {
  if (typingTimeline) {
    typingTimeline.kill()
    typingTimeline = null
  }
  isTyping.value = false
}

// --- Success animations ---
function playSuccessAnimation() {
  if (!wrapperRef.value) return
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

// --- Ink ripple celebration ---
function playInkRipple() {
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

// --- Submit handler ---
async function onSubmit() {
  if (!isValidEmail.value || loading.value || submitted.value) return
  errorMsg.value = ''
  loading.value = true

  runTypewriterAnimation()

  try {
    const params: Record<string, string> = { email: mail.value }
    if (props.source) params.source = props.source
    const body = new URLSearchParams(params)
    const res = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

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
    inset: -2px;
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
    transform: translateX(-100%);
    opacity: 0;
  }
}

.newsletter-shine::after {
  animation: shine-sweep 4s ease-in-out infinite;
}

@keyframes shine-sweep {
  0% { transform: translateX(-100%); opacity: 1; }
  20% { transform: translateX(100%); opacity: 1; }
  21% { opacity: 0; }
  100% { opacity: 0; }
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
    opacity: 0.8;
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
