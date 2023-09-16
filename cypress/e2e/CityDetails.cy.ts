describe("City details page", () => {
    it("clicking the city name navigates to the city details page", () => {
        cy.visit("/");
        cy.get("a")
            .contains(/Budapest/i)
            .click();
        cy.url().should("match", /city\/budapest/i);
    });
});
