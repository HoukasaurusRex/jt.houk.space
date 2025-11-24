<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-links">
        <a
          v-for="link in socialLinks"
          :key="link.type"
          :href="link.url"
          :aria-label="link.label"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          <component :is="link.icon" class="footer-icon" />
        </a>
      </div>
      <div class="footer-copyright">
        <p>{{ copyrightText }}</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

// Simple SVG icon components
const GitHubIcon = defineComponent({
  name: 'GitHubIcon',
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  `
})

const LinkedInIcon = defineComponent({
  name: 'LinkedInIcon',
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  `
})

const EmailIcon = defineComponent({
  name: 'EmailIcon',
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  `
})

export default defineComponent({
  name: 'Footer',
  components: {
    GitHubIcon,
    LinkedInIcon,
    EmailIcon,
  },
  setup() {
    const socialLinks = [
      {
        type: 'github',
        url: 'https://github.com/HoukasaurusRex',
        label: 'GitHub',
        icon: 'GitHubIcon',
      },
      {
        type: 'linkedin',
        url: 'https://linkedin.com/in/jt-houk',
        label: 'LinkedIn',
        icon: 'LinkedInIcon',
      },
      {
        type: 'email',
        url: 'mailto:jt@houk.space?subject=Hello%20From%20Your%20Site&body=',
        label: 'Email',
        icon: 'EmailIcon',
      },
    ]

    const copyrightText = computed(() => {
      const year = new Date().getFullYear()
      return `JT Houk © ${year}`
    })

    return {
      socialLinks,
      copyrightText,
    }
  },
})
</script>

<style lang="scss" scoped>
.site-footer {
  margin-top: 4rem;
  padding: 2.5rem 1.5rem 2rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--foreground-color);
}

.footer-content {
  max-width: 740px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: var(--accent-color);
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 4px;
    border-radius: 4px;
  }
}

.footer-icon {
  width: 20px;
  height: 20px;
}

.footer-copyright {
  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-color-75);
  }
}

@media (max-width: 719px) {
  .footer-links {
    gap: 1.5rem;
  }
}
</style>
