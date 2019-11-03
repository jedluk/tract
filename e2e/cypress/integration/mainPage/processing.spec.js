/// <reference types="Cypress" />
import MainPage from './MainPage';

context('Processing a file', () => {
  beforeEach(() => cy.visit('/'));

  it('should generate new image based on 2 images provided', function() {
    const mainPage = new MainPage();
    mainPage
      .uploadImage('lady.jpg', 0)
      .then(() => mainPage.uploadImage('cat.jpg', 1))
      .then(() => {
        mainPage.counterHasValue(4);
        mainPage.increaseClusters();
        mainPage.counterHasValue(5);
        mainPage.decreaseClusters();
        mainPage.counterHasValue(4);
        mainPage.runProcessing();
        mainPage.spinnerVisible();
        mainPage
          .readyImageBox()
          .children('img')
          .should('exist');
        mainPage
          .readyImageBox()
          .click()
          .location();
        cy.location('pathname').should('eq', '/gallery');
      });
  });
});
