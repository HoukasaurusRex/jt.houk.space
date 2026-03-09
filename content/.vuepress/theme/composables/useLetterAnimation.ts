import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import gsap from 'gsap'
import { showerThoughts } from '../data/showerThoughts'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]
const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min

type LetterPhase = 'falling' | 'piled' | 'forming' | 'formed' | 'dissolving'

interface LetterData {
  id: number
  char: string
}

const PILE_TARGET = 80
const PILE_TARGET_MOBILE = 40
const TOTAL_LETTERS = 120
const TOTAL_LETTERS_MOBILE = 60

export function useLetterAnimation(
  letterRefs: Ref<HTMLElement[]>,
  headingRef: Ref<HTMLElement | null>,
) {
  const isMobile = ref(false)
  const letters = ref<LetterData[]>([])

  // Track phase per letter by index
  const phases: LetterPhase[] = []
  let piledCount = 0
  let pileTarget = PILE_TARGET
  let totalLetters = TOTAL_LETTERS

  let ctx: gsap.Context | null = null
  let thoughtIndex = 0
  let formationInterval: ReturnType<typeof setInterval> | null = null
  let firstFormationTimeout: ReturnType<typeof setTimeout> | null = null
  let resizeTimer: ReturnType<typeof setTimeout> | null = null
  let resizeObserver: ResizeObserver | null = null

  // Pre-compute pile positions
  let pilePositions: Array<{ x: number; y: number; rotation: number; size: number }> = []

  function computePilePositions() {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const pileTop = vh * 0.82
    const pileHeight = vh * 0.15

    pilePositions = Array.from({ length: pileTarget }, () => ({
      x: randomBetween(vw * 0.05, vw * 0.95),
      y: randomBetween(pileTop, pileTop + pileHeight),
      rotation: randomBetween(-60, 60),
      size: randomBetween(14, 36),
    }))
  }

  function initLetters() {
    isMobile.value = window.innerWidth < 768
    pileTarget = isMobile.value ? PILE_TARGET_MOBILE : PILE_TARGET
    totalLetters = isMobile.value ? TOTAL_LETTERS_MOBILE : TOTAL_LETTERS

    letters.value = Array.from({ length: totalLetters }, (_, i) => ({
      id: i,
      char: randomChar(),
    }))

    phases.length = 0
    for (let i = 0; i < totalLetters; i++) {
      phases.push('falling')
    }
    piledCount = 0

    computePilePositions()
  }

  function startAmbientFalling() {
    const vw = window.innerWidth
    const vh = window.innerHeight

    letterRefs.value.forEach((el, i) => {
      const size = randomBetween(12, 48)
      const depth = (size - 12) / 36
      const opacity = 0.03 + depth * 0.15
      const x = randomBetween(0, vw)
      // Spread across a tall column so letters arrive at different times
      const startY = randomBetween(-vh * 3, vh * 0.6)

      el.style.fontSize = `${size}px`
      phases[i] = 'falling'

      gsap.set(el, { x, y: startY, opacity, rotation: randomBetween(-30, 30) })
      animateFall(el, i, vw, vh)
    })
  }

  function animateFall(el: HTMLElement, index: number, vw: number, vh: number) {
    const duration = randomBetween(4, 12)
    const drift = randomBetween(-60, 60)

    gsap.to(el, {
      y: vh + 50,
      x: `+=${drift}`,
      rotation: `+=${randomBetween(-45, 45)}`,
      duration,
      ease: 'none',
      onComplete: () => {
        if (phases[index] !== 'falling') return

        // Should this letter land in the pile?
        if (piledCount < pileTarget) {
          landInPile(el, index)
        } else {
          recycleToTop(el, index, vw, vh)
        }
      },
    })
  }

  function landInPile(el: HTMLElement, index: number) {
    const pos = pilePositions[piledCount % pilePositions.length]
    phases[index] = 'piled'
    piledCount++

    el.style.fontSize = `${pos.size}px`
    gsap.to(el, {
      x: pos.x,
      y: pos.y,
      rotation: pos.rotation,
      opacity: randomBetween(0.1, 0.25),
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  function recycleToTop(el: HTMLElement, index: number, vw: number, vh: number) {
    el.textContent = randomChar()
    const size = randomBetween(12, 48)
    const depth = (size - 12) / 36
    el.style.fontSize = `${size}px`
    phases[index] = 'falling'

    gsap.set(el, {
      x: randomBetween(0, vw),
      y: randomBetween(-vh * 1.5, -50),
      opacity: 0.03 + depth * 0.15,
      rotation: randomBetween(-30, 30),
    })
    animateFall(el, index, vw, vh)
  }

  function computeTargetPositions(text: string): Array<{ x: number; y: number }> {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const charWidth = isMobile.value ? 14 : 18
    const totalWidth = text.length * charWidth
    const startX = (vw - totalWidth) / 2

    // Position above the 404 heading, halfway between heading top and viewport top
    let targetY = vh * 0.3
    if (headingRef.value) {
      const rect = headingRef.value.getBoundingClientRect()
      targetY = rect.top / 2
    }

    return text.split('').map((_, i) => ({
      x: startX + i * charWidth,
      y: targetY,
    }))
  }

  function runFormation() {
    // Pick a thought that fits the current pile count
    let thought: string | null = null
    for (let attempt = 0; attempt < showerThoughts.length; attempt++) {
      const candidate = showerThoughts[(thoughtIndex + attempt) % showerThoughts.length]
      if (candidate.length <= piledCount) {
        thought = candidate
        thoughtIndex = (thoughtIndex + attempt + 1) % showerThoughts.length
        break
      }
    }
    if (!thought) return // No thought fits current pile

    const targets = computeTargetPositions(thought)
    const chars = thought.split('')
    const recruitCount = chars.length

    // Find piled letter indices
    const piledIndices: number[] = []
    for (let i = 0; i < phases.length && piledIndices.length < recruitCount; i++) {
      if (phases[i] === 'piled') piledIndices.push(i)
    }

    const recruitedEls = piledIndices.map((i) => letterRefs.value[i])
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Assign characters
    recruitedEls.forEach((el, i) => {
      el.textContent = chars[i]
    })

    // Mark as forming
    piledIndices.forEach((i) => {
      phases[i] = 'forming'
    })
    piledCount -= recruitCount

    const formTl = gsap.timeline()

    // Form: letters move to word positions
    formTl.to(recruitedEls, {
      x: (i: number) => targets[i].x,
      y: (i: number) => targets[i].y,
      rotation: 0,
      opacity: 1,
      fontSize: isMobile.value ? '14px' : '18px',
      duration: 1.5,
      ease: 'power2.inOut',
      stagger: 0.03,
      onStart: () => {
        piledIndices.forEach((i) => {
          phases[i] = 'forming'
        })
      },
      onComplete: () => {
        piledIndices.forEach((i) => {
          phases[i] = 'formed'
        })
      },
    })

    // Hold
    formTl.to({}, { duration: 3 })

    // Dissolve: letters fall away
    formTl.to(recruitedEls, {
      y: () => vh + randomBetween(50, 150),
      x: (i: number) => targets[i].x + randomBetween(-80, 80),
      rotation: () => randomBetween(-90, 90),
      opacity: 0,
      duration: 1,
      ease: 'power1.in',
      stagger: 0.02,
      onStart: () => {
        piledIndices.forEach((i) => {
          phases[i] = 'dissolving'
        })
      },
      onComplete: () => {
        // Recycle dissolved letters as falling
        piledIndices.forEach((idx) => {
          const el = letterRefs.value[idx]
          recycleToTop(el, idx, vw, vh)
        })
      },
    })
  }

  function startFormationCycle() {
    // Wait for enough pile letters to form the shortest thought
    const minChars = Math.min(...showerThoughts.map((s) => s.length))
    const checkPile = () => {
      if (piledCount >= minChars) {
        runFormation()
        formationInterval = setInterval(runFormation, 6000)
      } else {
        firstFormationTimeout = setTimeout(checkPile, 300)
      }
    }
    firstFormationTimeout = setTimeout(checkPile, 500)
  }

  function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      computePilePositions()
    }, 150)
  }

  function handleVisibility() {
    if (document.hidden) {
      gsap.globalTimeline.pause()
    } else {
      gsap.globalTimeline.resume()
    }
  }

  function cleanup() {
    if (ctx) {
      ctx.revert()
      ctx = null
    }
    if (formationInterval) {
      clearInterval(formationInterval)
      formationInterval = null
    }
    if (firstFormationTimeout) {
      clearTimeout(firstFormationTimeout)
      firstFormationTimeout = null
    }
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    document.removeEventListener('visibilitychange', handleVisibility)
    if (resizeTimer) clearTimeout(resizeTimer)
  }

  onMounted(() => {
    initLetters()

    // Wait for next tick so v-for refs are populated
    requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        startAmbientFalling()
        startFormationCycle()
      })
    })

    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(document.documentElement)

    document.addEventListener('visibilitychange', handleVisibility)
  })

  onUnmounted(cleanup)

  return { letters }
}
