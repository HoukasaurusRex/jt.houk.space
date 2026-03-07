describe('Articles listing page', () => {
  beforeEach(() => {
    cy.visit('/articles/')
  })

  it('renders a hero article card', () => {
    cy.get('.article-hero').should('exist')
    cy.get('.hero-title').should('be.visible').and('not.be.empty')
  })

  it('renders article cards below the hero', () => {
    cy.get('.article-card').should('have.length.greaterThan', 0)
  })

  it('each card shows a title', () => {
    cy.get('.card-title').first().should('be.visible').and('not.be.empty')
  })

  it('each card shows metadata (date)', () => {
    cy.get('.card-meta').first().should('exist')
  })

  it('each card shows tags', () => {
    cy.get('.pill').first().should('exist')
  })

  it('article card title links to the post page', () => {
    cy.get('.card-link').first().then(($a) => {
      const href = $a.attr('href')
      expect(href).to.match(/\/articles\/.+/)
    })
  })

  it('clicking an article card navigates to the post', () => {
    cy.get('.card-link').first().click()
    cy.url().should('match', /\/articles\/.+/)
  })
})
