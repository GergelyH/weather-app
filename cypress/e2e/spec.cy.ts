describe('The Home Page', () => {
  it('successfully loads, user can search for a city and add it to the list', () => {
    cy.visit('/');
    cy.get('[data-testid=add-city-button]').click();
    cy.url().should('include', '/add-city')
    cy.get('[data-testid=city-search-textbox]').type('Berl');
    cy.contains('Berlin');
  })
})