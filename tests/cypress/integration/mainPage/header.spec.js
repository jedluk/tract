/// <reference types="Cypress" />
import MainPage from './MainPage';

context('Header', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('APP_URL'));
  });
  it('should display title correctly', () => {
    const mainPage = new MainPage();
    mainPage()
      .find('h1')
      .should('be.visible')
      .should('have.text', 'Image rectification');

    mainPage()
      .find('h2')
      .should('be.visible')
      .should('have.text', 'Refresh appearance of your images in 3 simple steps !');
  });
});
