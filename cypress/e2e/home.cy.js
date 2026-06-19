describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the application", () => {
    cy.title().should("not.be.empty");
  });

  it("should display the navigation bar", () => {
    cy.get("nav").should("exist");
  });

  it("should display the footer", () => {
    cy.get("footer").should("exist");
  });

  it("should have a language selector", () => {
    cy.get("select").should("exist");
  });
});
