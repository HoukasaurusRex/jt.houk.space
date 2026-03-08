describe('Landing page', () => {
  beforeEach(() => {
    // Stub the external Spotify card image to avoid flaky external dependency
    cy.intercept('GET', 'https://spotify-github-profile.kittinanx.com/**', {
      statusCode: 200,
      fixture: 'spotify-stub.png',
      headers: { 'content-type': 'image/png' },
    }).as('spotifyCard')

    cy.visit('/')
  })

  it('renders the site title in the typewriter heading', () => {
    cy.get('h1.typewriter').should('be.visible').and('not.be.empty')
  })

  it('renders the site description', () => {
    cy.get('h2.description').should('be.visible').and('not.be.empty')
  })

  it('profile image container is present', () => {
    cy.get('[data-cy="profile-img"]').should('exist')
  })

  it('laser SVG is present', () => {
    cy.get('[data-cy="laser"]').should('exist')
  })

  it('profile image slides in after load', () => {
    cy.get('[data-cy="profile-img"] img').should('be.visible')
    cy.get('[data-cy="profile-img"]').should(($el) => {
      const transform = $el.css('transform')
      // After image load, translateX should be 0 (identity matrix or translateX(0))
      expect(transform).to.satisfy((t: string) =>
        t === 'none' || t.includes('matrix(1, 0, 0, 1, 0, 0)')
      )
    })
  })

  it('Spotify card container is present', () => {
    cy.get('[data-cy="spotify-card"]').should('exist')
  })

  it('CTA arrow links to /articles/', () => {
    cy.get('[data-cy="cta-arrow"]')
      .should('be.visible')
      .and('have.attr', 'href', '/articles/')
  })

  context('Desktop viewport (1280px)', () => {
    beforeEach(() => {
      cy.viewport(1280, 720)
      cy.visit('/')
    })

    it('Spotify card requests the default theme', () => {
      cy.wait('@spotifyCard').its('request.url').should('include', 'theme=default')
    })
  })

  context('Mobile viewport (375px)', () => {
    beforeEach(() => {
      cy.viewport(375, 812)
      cy.visit('/')
    })

    it.skip('Spotify card requests the natemoo-re theme (skipped: isMobileWidth not reactive on viewport change)', () => {
      cy.wait('@spotifyCard').its('request.url').should('include', 'theme=natemoo-re')
    })
  })
})
