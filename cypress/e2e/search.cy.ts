describe("Search", () => {
  it("Should display search header on home page", () => {
    cy.visit('/').then(() => {
      cy.get("#search-header").should("be.visible");
    });
  });

  it("Should not visible search header on other pages", () => {
    cy.visit('/contact').then(() => {
      cy.get("#search-header").should("not.exist");
    });
  });

  it("Should display small search header on other pages", () => {
    cy.visit("/contact").then(() => {
      cy.get("#search-header-small").should("be.visible");
    });
  });

  it("Should redirect to correct page after performing query",()=>{
    cy.visit('/').then(() => {
      cy.get("#search-header").should("be.visible");
      cy.get('#search-box').type('berlin',{force:true});
      cy.get("#search-header button[type='submit']").click();
      cy.url().should('include','/search?q=berlin');
    })
  })

  it("Should redirect to correct page after performing query on small search header", () => {
    cy.visit('/contact').then(() => {
      cy.get("#search-header-small").should("be.visible");
      cy.get('#search-header-small input').type('berlin');
      cy.get("#search-header-small button[type='submit']").click();
      cy.url().should('include','/search?q=berlin');
    })
  })


  it("Should display search results correctly", () => {
    cy.visit('/search?q=berlin').then(() => {
      cy.get('.search-item').should('have.length.at.least', 1);

      cy.get('.search-item-link').first().click({force:true});
      cy.url().should('include','/search-detail')
    })
  })

   it("Should not display search results when incorrect search happens", () => {
    cy.visit('/search?q=olahd').then(() => {
      cy.get('.search-item').should('have.length', 0);
    })
   })
});
