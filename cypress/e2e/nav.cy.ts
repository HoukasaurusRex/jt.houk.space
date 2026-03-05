describe('Navigation and layout', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('Nav links', () => {
    it('renders Articles link', () => {
      cy.get('nav a, .nav a').contains('Articles').should('be.visible')
    })

    it('renders About link', () => {
      cy.get('nav a, .nav a').contains('About').should('be.visible')
    })

    it('renders RaW link', () => {
      cy.get('nav a, .nav a').contains('RaW').should('be.visible')
    })

    it('renders Get In Touch link', () => {
      cy.get('nav a, .nav a').contains('Get In Touch').should('be.visible')
    })

    it('Articles link navigates to /articles/', () => {
      cy.get('nav a, .nav a').contains('Articles').click()
      cy.url().should('include', '/articles/')
    })
  })

  context('Footer', () => {
    it('renders footer with copyright year', () => {
      const year = new Date().getFullYear().toString()
      cy.get('.footer').should('be.visible').and('contain.text', year)
    })

    it('renders GitHub social link', () => {
      cy.get('.footer .contact-item a[href*="github"]').should('exist')
    })

    it('renders LinkedIn social link', () => {
      cy.get('.footer .contact-item a[href*="linkedin"]').should('exist')
    })

    it('renders email contact link', () => {
      cy.get('.footer .contact-item a[href*="mailto"]').should('exist')
    })
  })

  context('Notification banner', () => {
    beforeEach(() => {
      // Clear notification dismissal state before each test
      cy.clearLocalStorage()
      cy.visit('/')
    })

    it('renders the notification title', () => {
      cy.get('.alert').should('be.visible').and('contain.text', 'Help families in Gaza')
    })

    it('renders the notification description on desktop', () => {
      cy.viewport(1280, 720)
      cy.get('.alert .description').should('be.visible').and('not.be.empty')
    })

    it('closes the banner when X is clicked', () => {
      cy.get('.alert').should('be.visible')
      cy.get('.alert button').click()
      cy.get('.alert').should('not.be.visible')
    })

    it('banner stays hidden after dismissal and page reload', () => {
      cy.get('.alert button').click()
      cy.reload()
      cy.get('.alert').should('not.be.visible')
    })

    it('dismissed state persists in localStorage', () => {
      cy.get('.alert button').click()
      cy.window().then((win) => {
        const stored = win.localStorage.getItem('irc-donate-gaza')
        expect(stored).to.not.be.null
        expect(JSON.parse(stored!).isClosed).to.be.true
      })
    })
  })

  // Dark mode toggle is implemented in Phase 2 (issue #87).
  // Test is defined here as a placeholder — it will be filled in after
  // the useColorMode() composable is added and a toggle button exists in the nav.
  context('Dark mode toggle (Phase 2)', () => {
    it.skip('toggles dark class on <html> when clicked', () => {
      // TODO: implement after issue #87
    })
  })
})
