
function uploadArchive() {
  cy.visit('/')
  cy.get('button[id="user-menu-button"]').click()
  cy.get('input[placeholder="Username"]').type("admin")
  expect(Cypress.env('PASSWORD'), 'PASSWORD not available as ENV').to.exist
  cy.get('input[placeholder="Password"]').type(Cypress.env('PASSWORD'))
  cy.get('button').contains('Login').click()
  cy.wait(1500)
  cy.get('span').contains('Import').click()
  cy.get('input[type=file]').selectFile('cypress/fixtures/kant_urtheilskraft.ocrd.zip')
  cy.wait(500)
  cy.get('button').contains('Submit').click()
  cy.get('h4').filter(':contains(Success!)').should('have.length', 1)
  // It takes about 20 Seconds until the upload is available through search
}


describe("Import first Archive", () => {
  // The archive is only uploaded if olahd is empty
  it("Upload an archive if olahd is empty", () => {
    cy.visit('/search').then(() => {
      cy.wait(500)
      cy.get('p').invoke('text').then((val) => {
        if (val.includes("0 of 0 hits")) {
          uploadArchive()
        } else if (val.includes("of hits")) {
          cy.log("page not fully loaded")
        } else {
          cy.log("at least one archive is available: " + val)
        }
      })
    })
  })
});
