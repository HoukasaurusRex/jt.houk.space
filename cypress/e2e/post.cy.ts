describe('Article post page', () => {
  // Using a stable CMS-fetched article that includes <Newsletter /> and <Comments />
  const ARTICLE_PATH = '/articles/agile-cooking/'

  beforeEach(() => {
    // Block Disqus network requests to prevent flakiness — the container
    // element is still injected by vue-disqus regardless of the script loading
    cy.intercept('GET', '**disqus.com/**', { statusCode: 200, body: '' })
    cy.intercept('GET', '**disquscdn.com/**', { statusCode: 200, body: '' })
    cy.visit(ARTICLE_PATH)
  })

  it('renders the post title in h1', () => {
    cy.get('h1.post-title').should('be.visible').and('contain.text', 'Agile Cooking')
  })

  it('renders markdown content with headings', () => {
    cy.get('.vuepress-blog-theme-content h2').should('exist')
  })

  it('renders markdown content with paragraphs', () => {
    cy.get('.vuepress-blog-theme-content p').first().should('not.be.empty')
  })

  it('renders post metadata with author', () => {
    cy.get('.post-meta-author').should('be.visible').and('contain.text', 'JT Houk')
  })

  it('renders post metadata with date', () => {
    cy.get('.post-meta-date').should('be.visible')
  })

  it('Newsletter email input and submit button render', () => {
    cy.get('[data-cy="email"]').should('exist')
    cy.get('[data-cy="submit"]').should('exist')
  })

  it('invalid email does not trigger a submission', () => {
    // The Newsletter component guards with isValidEmail — an invalid address
    // short-circuits onSubmit before any fetch is made
    cy.intercept('POST', '/api/subscribe').as('subscribe')
    cy.get('[data-cy="email"]').type('not-an-email')
    cy.get('[data-cy="submit"]').click()
    // Button text stays "Subscribe" (no loading/submitted transition)
    cy.get('[data-cy="submit"]').should('contain.text', 'Subscribe')
    // Give the browser a tick, then confirm no request was sent
    cy.wait(300)
    cy.get('@subscribe.all').should('have.length', 0)
  })

  it('Disqus comment container is present in the DOM', () => {
    // vue-disqus always renders #disqus_thread; external scripts are stubbed above
    cy.get('#disqus_thread').should('exist')
  })
})
