describe("Lodging Search", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should navigate to lodging search page", () => {
    cy.contains("Alojamiento").should("exist");
  });

  it("should have lodging search form", () => {
    cy.get("input").should("exist");
    cy.get("button[type='submit']").should("exist");
  });
});
