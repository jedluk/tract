export default class MainPage {
  header = () => cy.get('header');

  modalBody = () => cy.get('.modal__body');

  modalButton = () => cy.get('.modal__button');

  glow = () => cy.get('div[data-time-of-creation]');

  uploadBox = child => cy.get('.uploadBox').eq(child);

  hasUploadedState = el => el.children('span.fa-check').should('exist');

  hasDragOverState = el => el.trigger('dragenter').should('have.class', 'customBorder');

  counterHasValue = value => cy.get('.uploadBox__counter').should('contain.text', value);

  increaseClusters = () => cy.get('.uploadBox__counter-box .fa-plus').click();

  decreaseClusters = () => cy.get('.uploadBox__counter-box .fa-minus').click();

  runProcessing = () => cy.get('.uploadBox span.fa-play-circle').click();

  spinnerVisible = () => cy.get('.uploadBox span.fa-spinner').should('exist');

  readyImageBox = () => cy.get('.readyImageBox', { timeout: 90 * 1000 });

  uploadImage = (fileName, boxNumber, flags = {}) =>
    new Cypress.Promise(resolve => {
      cy.fixture(`files/${fileName}`).then(fileContent => {
        this.uploadBox(boxNumber).upload(
          { fileContent, fileName, mimeType: 'text/plain' },
          { subjectType: 'drag-n-drop', ...flags }
        );
        resolve();
      });
    });
}
