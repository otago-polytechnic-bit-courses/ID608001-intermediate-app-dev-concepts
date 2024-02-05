describe("Tests", () => {
  it("should render Pride and Prejudice", () => {
    cy.visit("http://192.168.68.68:5173/");
    cy.contains("Pride and Prejudice").should("exist");
  });

  it("should click on the first Add to Cart button", () => {
    cy.visit("http://192.168.68.68:5173/");
    cy.get('[data-testid="add-to-cart-1"]').click();
  });
});
