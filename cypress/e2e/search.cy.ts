
describe("Search", () => {
  it("Should display search header on home page", () => {
    cy.visit("/home", () => {
      cy.get("#search-header").should("be.visible");
    });
  });

  it("Should not visible search header on other pages", () => {
    cy.visit("/home/about", () => {
      cy.get("#search-header").should("not.be.visible");
    });
  });

  it("Should display small search header on other pages", () => {
    cy.visit("/home/about", () => {
      cy.get("#search-header-small").should("be.visible");
    });
  });

  it("Should redirect to correct page after performing query",()=>{
    cy.visit('/home',()=>{
      cy.get("#search-header").should("be.visible");
      cy.get('#search-input').type('berlin');
      cy.get("#search-header button[type='submit']").click();
      cy.url().should('include','/search?q=berlin');
    })
  })

  it("Should redirect to correct page after performing query on small search header", () => {
     cy.visit('/home',()=>{
      cy.get("#search-header-small").should("be.visible");
      cy.get('#search-header-small input').type('berlin');
      cy.get("#search-header-small button[type='submit']").click();
      cy.url().should('include','/search?q=berlin');
    })
  })


  it("Should display search results correctly", () => {
    cy.visit('/home/search?q=berlin', () => {
      cy.get('.search-item').should('have.length.at.least', 1);

      cy.get('.search-item-link').first().click();
      cy.url().should('include','/home/search-detail')
    })
   })
});
