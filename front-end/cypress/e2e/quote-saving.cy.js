describe("Saving feature", () => {
	beforeEach(() => {
		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();
	});

	it("shows a form to submit a quote", () => {
		cy.get("[data-testid='quote-form']").as("quoteForm").should("exist");
		cy.get("@quoteForm").find("textarea").should("exist").should("be.enabled");
		cy.get("@quoteForm").find("input[name='author']").should("exist").should("be.enabled");
		cy.get("@quoteForm").find("button[type='submit']").should("exist").should("be.disabled");
	});

	it("shows the newly saved quote at the top of the list", () => {
		const quote = {
			content: `This is a new quote [${Date.now().toString()}]`,
			author: "Ipse",
		};

		cy.intercept("POST", "**/quotes").as("saveQuote");
		cy.intercept("GET", "**/quotes?**").as("getQuotes");
		cy.get("[data-testid='quote-form']").as("quoteForm");
		cy.get("@quoteForm").should("exist");
		cy.get("@quoteForm").find("textarea").type(quote.content);
		cy.get("@quoteForm").find("input[name='author']").type(quote.author);
		cy.get("@quoteForm").find("button[type='submit']").click();
		cy.wait(["@saveQuote", "@getQuotes"]);
		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("[data-testid='quotes-list']").as("quotesList");
		cy.get("@quotesList").should("exist");
		cy.get("@quotesList").find("figcaption").first().should("have.text", quote.author);
		cy.get("@quotesList").find("blockquote").first().should("have.text", quote.content);
	});
});
