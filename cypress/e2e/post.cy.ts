describe('Article post page', () => {
  const ARTICLE_PATH = '/articles/agile-cooking'

  beforeEach(() => {
    cy.visit(ARTICLE_PATH)
  })

  it('renders the post title', () => {
    cy.get('[vp-content] h1, .vp-doc h1').should('be.visible').and('contain.text', 'Agile Cooking')
  })

  it('renders markdown content with headings', () => {
    cy.get('[vp-content] h2, .vp-doc h2').should('exist')
  })

  it('renders markdown content with paragraphs', () => {
    cy.get('[vp-content] p, .vp-doc p').first().should('not.be.empty')
  })

  it('Newsletter email input and submit button render', () => {
    cy.get('[data-cy="email"]').should('exist')
    cy.get('[data-cy="submit"]').should('exist')
  })

  it('invalid email does not trigger a submission', () => {
    cy.intercept('POST', '/api/subscribe').as('subscribe')
    cy.get('[data-cy="email"]').type('not-an-email')
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="submit"]').should('contain.text', 'Subscribe')
    cy.wait(300)
    cy.get('@subscribe.all').should('have.length', 0)
  })

  it('Giscus comment container is present in the DOM', () => {
    cy.get('#comments').should('exist')
  })
})
