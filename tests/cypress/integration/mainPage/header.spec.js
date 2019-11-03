/// <reference types="Cypress" />

context('Header', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });
  it('should display title correctly', () => {
    cy.get('header')
      .find('h1')
      .should('be.visible')
      .should('have.text', 'Image rectification');

    cy.get('header')
      .find('h2')
      .should('be.visible')
      .should('have.text', 'Refresh appearance of your images in 3 simple steps !');
  });
});
