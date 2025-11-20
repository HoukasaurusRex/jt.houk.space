<template>
  <div>
    <div class="profile-img" :style="profileLoadedStyles">
      <transition name="fade">
        <img ref="profileImg" v-show="profileImgLoaded" @load="onLoadProfileImg" src="/jt-face-right.webp" height="100%" width="0" alt=""/>
      </transition>
      <Laser class="laser" :style="profileLoadedLaserStyles" />
    </div>
    <main class="landing">
      <h1 class="typewriter">{{title}}</h1>
      <h2 class="description">{{description}}</h2>
        <div class="spotify-card">
          <a href="https://spotify-github-profile.vercel.app/api/view?uid=spacemanjohn&redirect=true" target="_blank" rel="noopener">
              <transition name="fade">
                <img v-show="spotifyImgLoaded" @load="onLoadSpotifyImg" :src="spotifyCard" height="100%" alt="">
              </transition>
          </a>
        </div>
    </main>
    <RightArrow class="arrow"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { usePageData, usePageFrontmatter, useSiteData } from 'vuepress/client'
import RightArrow from './RightArrow.vue'
import Laser from './Laser.vue'

export default defineComponent({
  name: 'Landing',
  components: { RightArrow, Laser },
  setup() {
    const page = usePageData()
    const frontmatter = usePageFrontmatter()
    const site = useSiteData()
    
    const profileImgLoaded = ref(false)
    const spotifyImgLoaded = ref(false)
    const profileImg = ref<HTMLImageElement | null>(null)

    const title = computed(() => {
      return frontmatter.value.heroText || frontmatter.value.title || site.value.title
    })

    const description = computed(() => {
      return site.value.description
    })

    const isMobileWidth = computed(() => {
      return typeof window !== 'undefined' && window.innerWidth <= 425
    })

    const spotifyCardTheme = computed(() => {
      return isMobileWidth.value ? 'natemoo-re' : 'default'
    })

    const spotifyCard = computed(() => {
      return `https://spotify-github-profile.vercel.app/api/view?uid=spacemanjohn&cover_image=true&theme=${spotifyCardTheme.value}`
    })

    const profileLoadedStyles = computed(() => {
      return profileImgLoaded.value ? {
        transform: 'translateX(0)'
      } : {
        transform: 'translateX(-250px)'
      }
    })

    const profileLoadedLaserStyles = computed(() => {
      return profileImgLoaded.value ? {
        transform: 'translateX(0)'
      } : {
        transform: 'translateX(250px)'
      }
    })

    const onLoadProfileImg = () => {
      profileImgLoaded.value = true
      setTimeout(() => {
        if (profileImg.value) {
          profileImg.value.width = `${profileImg.value.height * (610 / 725)}`
        }
      }, 500)
    }

    const onLoadSpotifyImg = () => {
      spotifyImgLoaded.value = true
    }

    return {
      profileImg,
      profileImgLoaded,
      spotifyImgLoaded,
      title,
      description,
      spotifyCard,
      profileLoadedStyles,
      profileLoadedLaserStyles,
      onLoadProfileImg,
      onLoadSpotifyImg,
    }
  },
})
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
    filter: drop-shadow(2px 5px 5px var(--shadow-color));
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
  box-shadow: var(--box-shadow-back);
  transition: all 0.15s ease;
  opacity: 0.9;
  &:hover {
    box-shadow: var(--box-shadow-mid);
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
