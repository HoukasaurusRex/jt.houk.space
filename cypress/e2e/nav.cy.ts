describe('Navigation and layout', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('Nav links', () => {
    it('renders Articles link', () => {
      cy.get('nav a, .vp-navbar a').contains('Articles').should('be.visible')
    })

    it('renders About link', () => {
      cy.get('nav a, .vp-navbar a').contains('About').should('be.visible')
    })

    it('renders RaW link', () => {
      cy.get('nav a, .vp-navbar a').contains('RaW').should('be.visible')
    })

    it('renders Get In Touch link', () => {
      cy.get('nav a, .vp-navbar a').contains('Get In Touch').should('be.visible')
    })

    it('Articles link navigates to /articles/', () => {
      cy.get('nav a, .vp-navbar a').contains('Articles').click()
      cy.url().should('include', '/articles/')
    })
  })

  context('Notification banner', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.visit('/articles/')
    })

    it('renders the notification title on article pages', () => {
      cy.get('.alert').should('be.visible').and('contain.text', 'Help families in Gaza')
    })

    it('notification is hidden on landing page', () => {
      cy.visit('/')
      cy.get('.alert').should('not.be.visible')
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

  context('Dark mode toggle', () => {
    it('toggles data-theme on html when clicked', () => {
      cy.get('.vp-toggle-color-mode-button').click()
      cy.get('html').should('have.attr', 'data-theme')
    })
  })
})
