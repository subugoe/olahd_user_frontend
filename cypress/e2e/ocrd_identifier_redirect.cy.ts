describe("Ocrd-Identifier Redirect", () => {
  it("Should redirect for existing Ocrd-Identifier", () => {
    cy.visit('/ocrd-identifier?id=ocrd_data_structur_kant_urtheilskraft_1790').then(() => {
      cy.url().should("include", "/search-detail");
      cy.url().should("not.include", "/ocrd-identifier");
    });
  });

  it("Should display error for unknown Ocrd-Identifier", () => {
    cy.visit('/ocrd-identifier?id=not_available_ocrdidentifier').then(() => {
      cy.url().should("include", "/ocrd-identifier");
      cy.contains("not found");
    });
  });
});
