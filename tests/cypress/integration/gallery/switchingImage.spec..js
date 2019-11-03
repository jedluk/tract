/// <reference types="Cypress" />
import GalleryPage from './GalleryPage';

context('Gallery image picker', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('APP_URL')}/gallery`);
  });

  it('should allow to switch main image', () => {
    const galleryPage = new GalleryPage();
    galleryPage.galleryImages().should('have.length', 4);
    [...Array(4).keys()].forEach(idx => {
      galleryPage
        .galleryImages()
        .eq(idx)
        .click()
        .invoke('attr', 'src')
        .then(galleryImgSrc => {
          galleryPage
            .mainImg()
            .invoke('attr', 'src')
            .then(mainImgSrc => expect(galleryImgSrc).equal(mainImgSrc));
        });
    });
  });
});
