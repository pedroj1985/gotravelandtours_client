// Custom Cypress commands
// Learn more: https://on.cypress.io/custom-commands

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get("button[type='submit']").click();
});

Cypress.Commands.add("logout", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
