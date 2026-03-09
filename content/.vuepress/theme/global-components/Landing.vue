<template>
  <div class="landing-hero">
    <div class="profile-img" :style="profileLoadedStyles" data-cy="profile-img">
      <transition name="fade">
        <img v-show="profileImgLoaded" ref="profileImg" src="/jt-face-right.webp" alt="JT Houk" @load="onLoadProfileImg"/>
      </transition>
      <Laser class="laser" :class="{ 'laser-active': echoLaserActive }" :style="profileLoadedLaserStyles" data-cy="laser" />
      <span v-if="echoLaserActive && echoText" class="echo-projectile">{{ echoText }}</span>
    </div>
    <main class="landing">
      <div class="terminal-input" @click="focusInput">
        <h1 :class="['typewriter', { editing: isEditing }]">
          <span class="terminal-prefix">&gt; </span>
          <template v-if="!isEditing">
            <span
              v-for="(seg, i) in parsedTitle"
              :key="i"
              :class="'terminal-' + seg.style"
            >{{ seg.text }}</span>
          </template>
          <template v-else>
            <template v-if="parsedInput.length">
              <span
                v-for="(seg, i) in parsedInput"
                :key="i"
                :class="'terminal-' + seg.style"
              >{{ seg.text }}</span>
            </template>
            <span v-else>&#8203;</span>
          </template>
        </h1>
        <input
          ref="terminalInputEl"
          v-model="inputText"
          class="terminal-hidden-input"
          aria-label="Terminal input"
          @keydown.enter.prevent="onEnter"
          @blur="onBlur"
        />
      </div>
      <div class="terminal-output-wrapper">
        <TerminalOutput :result="outputResult" />
      </div>
      <h2 class="description">{{ description }}</h2>
      <div class="spotify-card" data-cy="spotify-card">
        <a href="https://open.spotify.com/playlist/4bTtFYlmWGoiw8wtUsQPHO?si=qimf3FqaT9-hOwiqXDEAEg" target="_blank" rel="noopener">
          <transition name="fade">
            <img v-show="spotifyImgLoaded" :src="spotifyCard" alt="Currently listening on Spotify" @load="onLoadSpotifyImg">
          </transition>
        </a>
      </div>
    </main>
    <RightArrow class="arrow" data-cy="cta-arrow"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePageData, useSiteData } from '@vuepress/client'
import { useRouter } from 'vuepress/client'
import RightArrow from '../components/RightArrow.vue'
import Laser from '../components/Laser.vue'
import TerminalOutput from '../components/TerminalOutput.vue'
import { useTerminal } from '../composables/useTerminal'
import { useJournalUnlock } from '../composables/useJournalUnlock'

const page = usePageData()
const site = useSiteData()
const router = useRouter()
const journalUnlock = useJournalUnlock()

const {
  inputText, outputResult, isEditing, echoLaserActive, echoText,
  parseCommand, parsedInput, execute, resetToDefault,
} = useTerminal(router, journalUnlock)

const profileImgLoaded = ref(false)
const spotifyImgLoaded = ref(false)
const profileImg = ref<HTMLImageElement | null>(null)
const terminalInputEl = ref<HTMLInputElement | null>(null)

const title = computed(() =>
  (page.value.frontmatter.heroText as string | undefined)
  ?? (page.value.frontmatter.title as string | undefined)
  ?? site.value.title
)
const parsedTitle = computed(() => parseCommand(title.value))
const description = computed(() => site.value.description)

const isMobileWidth = computed(() =>
  typeof window !== 'undefined' && window.innerWidth <= 425
)
const spotifyCardTheme = computed(() => isMobileWidth.value ? 'natemoo-re' : 'default')
const spotifyCard = computed(() =>
  `https://spotify-github-profile.kittinanx.com/api/view?uid=spacemanjohn&cover_image=true&theme=${spotifyCardTheme.value}`
)

const profileLoadedStyles = computed(() =>
  profileImgLoaded.value
    ? { transform: 'translateX(0)' }
    : { transform: 'translateX(-250px)' }
)
const profileLoadedLaserStyles = computed(() =>
  profileImgLoaded.value
    ? { transform: 'translateX(0)' }
    : { transform: 'translateX(250px)' }
)

function onLoadProfileImg() {
  profileImgLoaded.value = true
}

function onLoadSpotifyImg() {
  spotifyImgLoaded.value = true
}

function focusInput() {
  if (!isEditing.value) {
    inputText.value = ''
  }
  isEditing.value = true
  terminalInputEl.value?.focus()
}

function onEnter() {
  if (document.activeElement === terminalInputEl.value) {
    execute()
  }
}

function onBlur() {
  if (!inputText.value.trim()) {
    resetToDefault()
  }
}

const INTERACTIVE_TAGS = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'])

function onGlobalKeydown(e: KeyboardEvent) {
  if (INTERACTIVE_TAGS.has((document.activeElement?.tagName ?? ''))) return
  if (e.metaKey || e.ctrlKey || e.altKey) return
  if (e.key.length !== 1) return
  focusInput()
}

onMounted(() => {
  const img = profileImg.value
  if (img?.complete && img.naturalWidth > 0) onLoadProfileImg()

  if (!isMobileWidth.value) {
    setTimeout(() => {
      terminalInputEl.value?.focus()
    }, 2000)
  }

  document.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<style scoped>
.landing-hero {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.landing {
  margin: 0 auto;
  padding-top: 2rem;
  text-align: center;
  h1 {
    margin-top: 2.75rem;
  }
}

.terminal-input {
  position: relative;
  cursor: text;
}

.terminal-hidden-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.terminal-prefix {
  color: var(--accent-color);
}

.terminal-output-wrapper {
  height: 2rem;
}

.terminal-error { color: var(--red); }
.terminal-success { color: var(--green); }
.terminal-string { color: var(--yellow); }

.laser-active {
  filter: saturate(3);
  transform: scaleY(1.1);
}

.echo-projectile {
  position: absolute;
  left: 0;
  top: calc(50% - 50px);
  transform: translateY(-50%);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
  text-shadow: 0 0 8px var(--accent-color), 0 0 16px var(--accent-color);
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
  animation: echoShoot 2s cubic-bezier(0.15, 0, 1, 0.3) forwards;
}

@keyframes echoShoot {
  0% {
    left: 20%;
    opacity: 0;
    font-size: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    left: 120%;
    opacity: 1;
    font-size: 3.5rem;
  }
}

.profile-img {
  height: 50vh;
  width: calc(100vw + 100px);
  position: absolute;
  left: -100px;
  bottom: -70px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  transition: all 0.1s ease;
  img {
    height: 100%;
    width: auto;
    transition: all 0.1s ease;
    filter: drop-shadow(2px 5px 5px #222);
  }
}

.laser {
  width: calc(100vw + 180px);
  overflow: hidden;
  margin-left: -80px;
  margin-top: -100px;
  transition: all 0.1s ease;
  transform-origin: center left;
}

.arrow {
  position: absolute;
  top: 40%;
  right: 20vw;
  background-color: var(--accent-color);
  background-image: none;
  width: 4em;
  height: 1.6em;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  border-radius: 5px;
  box-shadow: 1px 1px 2px #222;
  transition: all 0.15s ease;
  opacity: 0.9;
  &:hover {
    box-shadow: 1.5px 1.5px 3px #222;
    transform: scale(1.01);
  }
  :deep(a) {
    background-image: none;
    text-decoration: none;
  }
}

.description {
  font-size: 1rem;
}

.spotify-card {
  min-height: 80px;
  min-width: 290px;
  margin: 4.5rem auto;
  display: flex;
  justify-content: center;
  img {
    max-height: 320px;
  }
}
</style>
