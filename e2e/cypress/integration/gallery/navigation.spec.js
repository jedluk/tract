/// <reference types="Cypress" />
import GalleryPage from './GalleryPage';

context('Navigation', () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env('APP_URL')}/gallery`, { timeout: 7 * 1000 });
    cy.location().should(location => {
      expect(location.hash).to.be.empty;
      expect(location.search).to.be.empty;
      expect(location.origin).to.eq(Cypress.env('APP_URL'));
      expect(location.pathname).to.eq('/gallery');
    });
  });
  const galleryPage = new GalleryPage();
  describe('gallery navigation', () => {
    it('should redirect back to main page', () => {
      galleryPage.homeLink().click();
      cy.location().should(loc => expect(loc.pathname).to.be.eq('/'));
    });
    it('should have link to pexels', () => {
      galleryPage.pexelsLink().should('have.attr', 'target', '_blank');
      galleryPage
        .pexelsLink()
        .should('have.prop', 'href')
        .and('equal', 'https://www.pexels.com/');
    });
  });
});
