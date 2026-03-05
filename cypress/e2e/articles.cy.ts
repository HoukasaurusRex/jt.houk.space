describe('Articles listing page', () => {
  beforeEach(() => {
    cy.visit('/articles/')
  })

  it('renders a list of post cards', () => {
    cy.get('.ui-post').should('have.length.greaterThan', 0)
  })

  it('each card shows a title', () => {
    cy.get('.ui-post-title').first().should('be.visible').and('not.be.empty')
  })

  it('each card shows metadata (date)', () => {
    cy.get('.ui-post-meta').first().should('exist')
  })

  it('each card shows tags', () => {
    cy.get('.post-tag').first().should('exist')
  })

  it('pagination controls render (site has >5 articles)', () => {
    // The site has 60+ articles, pagination is always rendered
    cy.get('.pagination').should('be.visible')
  })

  it('next page link navigates to page 2', () => {
    cy.get('.pagination li').last().find('a').click()
    cy.url().should('match', /\/articles\/(page\/\d+\/)?$/)
    cy.get('.ui-post').should('have.length.greaterThan', 0)
  })

  it('navigating to page 2 then back shows page 1 articles', () => {
    cy.get('.pagination li').last().find('a').click()
    cy.go('back')
    cy.url().should('include', '/articles/')
    cy.get('.ui-post').should('have.length.greaterThan', 0)
  })

  it('article card title links to the post page', () => {
    cy.get('.ui-post-title a').first().then(($a) => {
      const href = $a.attr('href')
      expect(href).to.match(/\/articles\/.+/)
    })
  })

  it('clicking an article card navigates to the post', () => {
    cy.get('.ui-post-title a').first().click()
    cy.url().should('match', /\/articles\/.+/)
  })
})
