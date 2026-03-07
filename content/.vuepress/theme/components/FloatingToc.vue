<template>
  <aside v-if="headers.length" class="floating-toc">
    <ul>
      <template v-for="header in headers" :key="header.link">
        <li :class="{ active: activeLink === header.link }">
          <a :href="header.link">{{ header.title }}</a>
        </li>
        <li
          v-for="child in (header.children || [])"
          :key="child.link"
          :class="['toc-child', { active: activeLink === child.link }]"
        >
          <a :href="child.link">{{ child.title }}</a>
        </li>
      </template>
      <li :class="{ active: activeLink === '#comments' }">
        <a href="#comments">Comments</a>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { useHeaders } from '@theme/useHeaders'
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const headers = useHeaders()
const activeLink = ref('')

let observer: IntersectionObserver | null = null

function getAllLinks(): string[] {
  const links: string[] = []
  for (const h of headers.value) {
    links.push(h.link)
    if (h.children) {
      for (const c of h.children) {
        links.push(c.link)
      }
    }
  }
  links.push('#comments')
  return links
}

function observe() {
  observer?.disconnect()

  const links = getAllLinks()
  if (links.length === 0) return

  const headingEls = links
    .map(link => document.getElementById(link.slice(1)))
    .filter((el): el is HTMLElement => el !== null)

  if (headingEls.length === 0) return

  // Track which headings are in the top portion of the viewport
  const visibleIds = new Set<string>()

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = '#' + entry.target.id
        if (entry.isIntersecting) {
          visibleIds.add(id)
        } else {
          visibleIds.delete(id)
        }
      }

      // Pick the first visible heading in document order
      for (const link of links) {
        if (visibleIds.has(link)) {
          activeLink.value = link
          return
        }
      }
    },
    { rootMargin: '0px 0px -80% 0px' }
  )

  for (const el of headingEls) {
    observer.observe(el)
  }
}

onMounted(() => {
  observe()
  const links = getAllLinks()
  if (links.length > 0 && !activeLink.value) {
    activeLink.value = links[0]
  }
})

watch(headers, async () => {
  await nextTick()
  observe()
  const links = getAllLinks()
  if (links.length > 0 && !activeLink.value) {
    activeLink.value = links[0]
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
