/// <reference types="Cypress" />
import GalleryPage from './GalleryPage';

context('Download functionality', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('APP_URL')}/gallery`);
  });

  it('should allow to download a image', () => {
    const galleryPage = new GalleryPage();
    galleryPage.downloadIcon().should('exist');
    galleryPage
      .downloadLink()
      .invoke('attr', 'href')
      .then(href => expect(href).to.match(/api\/samples\/\w+\.jpg$/));
  });
});
