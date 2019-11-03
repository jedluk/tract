/// <reference types="Cypress" />
import MainPage from './MainPage';

context('Drag and Drop', () => {
  beforeEach(() => cy.visit('/'));

  describe('dragging and dropping file', function() {
    it('should not allow to upload non-image files', function() {
      const mainPage = new MainPage();
      const CHILD = 0;
      const fileName = 'file.txt';
      mainPage.uploadImage(fileName, CHILD, { force: true }).then(() => {
        mainPage
          .modalBody()
          .should('be.visible')
          .should('contain.text', 'unsupported');
        mainPage.modalButton().click();
        mainPage.modalBody().should('not.exist');
      });
    });

    it('show allow to drop image on gray image area', function() {
      const mainPage = new MainPage();
      const fileName = 'lady.jpg';
      const CHILD = 0;
      mainPage.uploadImage(fileName, CHILD).then(() => {
        const uploadBox = mainPage.uploadBox(CHILD);
        mainPage.hasUploadedState(uploadBox);
      });
    });

    it('show allow to drop image on color image area', function() {
      const mainPage = new MainPage();
      const fileName = 'cat.jpg';
      const CHILD = 1;
      mainPage.uploadImage(fileName, CHILD).then(() => {
        const uploadBox = mainPage.uploadBox(CHILD);
        mainPage.hasUploadedState(uploadBox);
      });
    });
  });
});
