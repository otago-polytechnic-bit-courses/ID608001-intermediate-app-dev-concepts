// Note: Replace <Network address> with the network address of your application

describe("Tests", () => {
  it("should render Pride and Prejudice", () => {
    cy.visit("<Network address>:5173/");
    cy.contains("Pride and Prejudice").should("exist");
  });

  it("should click on the first Add to Cart button", () => {
    cy.visit("<Network address>:5173/");
    cy.get('[data-testid="add-to-cart-1"]').click();
  });
});
