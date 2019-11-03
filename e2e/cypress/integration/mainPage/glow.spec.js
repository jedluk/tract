/// <reference types="Cypress" />
import MainPage from './MainPage';

const getTimeOfCreation = el => parseInt(el.dataset.timeOfCreation);

context('Glow', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('APP_URL'));
  });

  it('should be visible when moving mouse through the header area', () => {
    const mainPage = new MainPage();
    mainPage
      .header()
      .trigger('mousedown')
      .trigger('mousemove', 10, 10) // 1
      .trigger('mousemove', 11, 11) // 2
      .trigger('mousemove', 12, 12)
      .trigger('mousemove', 13, 13)
      .trigger('mousemove', 14, 14)
      .trigger('mousemove', 15, 15)
      .trigger('mousemove', 20, 20)
      .trigger('mousemove', 25, 20)
      .trigger('mousemove', 30, 20)
      .trigger('mousemove', 35, 20) //10
      .trigger('mouseup')
      .find('div[data-time-of-creation]')
      .should('have.length', 10);

    mainPage.glow().each(($el, index, $list) => {
      // last child has no next element
      if (index !== $list.length - 1) {
        const currentCreatedTime = getTimeOfCreation($list[index]);
        const nextCreatedTime = getTimeOfCreation($list[index + 1]);
        expect(currentCreatedTime).to.be.lessThan(nextCreatedTime);
      }
    });

    cy.wait(3000);
    mainPage.glow().should('not.exist');
  });
});
