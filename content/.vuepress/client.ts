import { defineClientConfig } from 'vuepress/client'
import './theme/styles/index.scss'

// Global components that were previously auto-registered via the blog theme
// are now explicitly registered here. Component rewrites (Chakra → Tailwind)
// happen in issues #85–#88; stubs are registered now to keep the build green.

export default defineClientConfig({
  enhance({ app }) {
    // Chakra UI and vue-disqus are removed in issues #85 and #89.
    // Dark mode composable is added in issue #87.
    // Component registrations will be added as each component is rewritten.
    void app
  },
  setup() {
    // Composable hooks (e.g. useColorMode) will be added here in issue #87.
  },
})
