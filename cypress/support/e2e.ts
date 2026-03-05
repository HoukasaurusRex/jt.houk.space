// Global E2E support file — runs before every spec.
// Add custom commands or global hooks here.

// Suppress Cypress's default behavior of failing on uncaught exceptions
// from third-party scripts (Disqus, Umami, Spotify embed).
Cypress.on('uncaught:exception', (err) => {
  // Return false to prevent the test from failing on third-party errors
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Script error')
  ) {
    return false
  }
})
