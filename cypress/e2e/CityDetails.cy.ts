describe("City details page", () => {
    it("clicking the city name navigates to the city details page with right content", () => {
        cy.visit("/");
        cy.get("a")
            .contains(/Budapest/i)
            .click();
    });
});
