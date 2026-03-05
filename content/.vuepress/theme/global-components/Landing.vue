<template>
  <div>
    <div class="profile-img" :style="profileLoadedStyles" data-cy="profile-img">
      <transition name="fade">
        <img ref="profileImg" v-show="profileImgLoaded" @load="onLoadProfileImg" src="/jt-face-right.webp" height="100%" width="0" alt="JT Houk"/>
      </transition>
      <Laser class="laser" :style="profileLoadedLaserStyles" data-cy="laser" />
    </div>
    <main class="landing">
      <h1 class="typewriter">{{ title }}</h1>
      <h2 class="description">{{ description }}</h2>
      <div class="spotify-card" data-cy="spotify-card">
        <a href="https://open.spotify.com/playlist/4bTtFYlmWGoiw8wtUsQPHO?si=qimf3FqaT9-hOwiqXDEAEg" target="_blank" rel="noopener">
          <transition name="fade">
            <img v-show="spotifyImgLoaded" @load="onLoadSpotifyImg" :src="spotifyCard" height="100%" alt="Currently listening on Spotify">
          </transition>
        </a>
      </div>
    </main>
    <RightArrow class="arrow" data-cy="cta-arrow"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageData, useSiteData } from '@vuepress/client'
import RightArrow from '../components/RightArrow.vue'
import Laser from '../components/Laser.vue'

const page = usePageData()
const site = useSiteData()

const profileImgLoaded = ref(false)
const spotifyImgLoaded = ref(false)
const profileImg = ref<HTMLImageElement | null>(null)

const title = computed(() =>
  (page.value.frontmatter.heroText as string | undefined)
  ?? (page.value.frontmatter.title as string | undefined)
  ?? site.value.title
)
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
  setTimeout(() => {
    const img = profileImg.value
    if (img) img.width = img.height * (610 / 725)
  }, 500)
}

function onLoadSpotifyImg() {
  spotifyImgLoaded.value = true
}
</script>

<style lang="scss" scoped>
.landing {
  margin: 0 auto;
  text-align: center;
}

.profile-img {
  height: 50vh;
  width: calc(100vw + 100px);
  position: absolute;
  left: -100px;
  bottom: 0;
  margin-bottom: 72px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  transition: all 0.1s ease;
  img {
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
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  box-shadow: 1px 1px 2px #222;
  transition: all 0.15s ease;
  opacity: 0.9;
  &:hover {
    box-shadow: 1.5px 1.5px 3px #222;
    transform: scale(1.01);
  }
}

.description {
  font-size: 1rem;
}

.spotify-card {
  min-height: 80px;
  min-width: 290px;
  margin: 0 auto;
  img {
    max-height: 320px;
  }
}
</style>
