describe("Pagination feature", () => {
	it("allows the user to navigate between pages", () => {
		cy.intercept("POST", "**/quotes").as("saveQuote");
		cy.intercept("GET", "**/quotes?**").as("getQuotes");

		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();

		cy.get("[data-testid='quote-form']").as("quoteForm").should("exist");

		for (let i = 0; i < 10; i++) {
			const quote = {
				content: `This is a new quote [${Date.now().toString()}]`,
				author: "Ipse",
			};

			cy.get("@quoteForm").find("textarea").type(quote.content);
			cy.get("@quoteForm").find("input[name='author']").type(quote.author);
			cy.get("@quoteForm").find("button[type='submit']").click();
			cy.wait(["@saveQuote", "@getQuotes"]);
			cy.wait(2000); // Gives React the time to update the UI.

			if (i === 0) {
				cy.get("[data-testid='quotes-list']").as("quotesList").should("exist");
			}

			cy.get("@quotesList").find("li").first().find("figcaption").should("have.text", quote.author);
			cy.get("@quotesList").find("blockquote").first().should("have.text", quote.content);
		}

		cy.get("[data-testid='next-page-button']").click();
		cy.wait("@getQuotes");
		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("@quotesList")
			.find("li")
			.first()
			.invoke("attr", "data-before")
			.then(parseInt)
			.should("be.greaterThan", 1);

		cy.get("[data-testid='prev-page-button']").click().should("be.disabled");
		cy.get("@quotesList")
			.find("li")
			.first()
			.invoke("attr", "data-before")
			.then(parseInt)
			.should("equal", 1);
	});
});
