/// <reference types="Cypress" />
import MainPage from './MainPage';

context('Header', () => {
  beforeEach(() => cy.visit('/'));

  it('should display title correctly', () => {
    const mainPage = new MainPage();
    mainPage
      .header()
      .find('h1')
      .should('be.visible')
      .should('have.text', 'Image rectification');

    mainPage
      .header()
      .find('h2')
      .should('be.visible')
      .should('have.text', 'Refresh appearance of your images in 3 simple steps !');
  });
});
