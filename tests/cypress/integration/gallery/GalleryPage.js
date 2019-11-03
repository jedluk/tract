export default class GalleryPage {
  mainImg = () => cy.get('.main-img img');

  downloadIcon = () => cy.get('span.main-img__download-icon');

  downloadLink = () => cy.get('.main-img a[download]');

  galleryImages = () => cy.get('div.imgs img');

  homeLink = () => cy.get('footer div.goHome').children('a');

  pexelsLink = () => cy.get('footer a[target="_blank"]');
}
