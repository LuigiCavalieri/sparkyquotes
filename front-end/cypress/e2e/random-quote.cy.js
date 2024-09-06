describe("Random quote feature", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/quotes/random").as("getRandomQuote");
		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();
		cy.wait("@getRandomQuote");
	});

	it("shows a quote when the page loads", () => {
		cy.get("[data-testid='random-quote-content']").as("random-quote");
		cy.get("@random-quote").should("exist").invoke("text").should("have.length.at.least", 5);
	});

	it("shows a new quote when the page reloads", () => {
		cy.get("[data-testid='random-quote-content']").as("randomQuote");
		cy.get("@randomQuote")
			.should("exist")
			.invoke("text")
			.then(quoteContent => {
				cy.wrap(quoteContent).as("first-random-quote-content");
			});
		cy.reload();
		cy.get("@randomQuote")
			.should("exist")
			.invoke("text")
			.then(quoteContent => {
				cy.wrap(quoteContent).should("have.length.at.least", 5);
				cy.get("@first-random-quote-content").should("not.be.equal", quoteContent);
			});
	});

	it("saves the quote to the list when the user clicks on 'save'", () => {
		cy.intercept("POST", "**/quotes").as("saveQuote");
		cy.intercept("GET", "**/quotes?**").as("getQuotes");
		cy.get("[data-testid='random-quote-content']")
			.should("exist")
			.invoke("text")
			.then(quoteContent => {
				cy.wrap(quoteContent).as("randomQuoteContent");
			});
		cy.get("[data-testid='random-quote-author']")
			.should("exist")
			.invoke("text")
			.then(quoteContent => {
				cy.wrap(quoteContent).as("randomQuoteAuthor");
			});
		cy.get("[data-testid='random-quote-save-button']").click();
		cy.wait(["@saveQuote", "@getQuotes"]);
		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("[data-testid='quotes-list']").as("quotesList");
		cy.get("@quotesList")
			.find("blockquote")
			.first()
			.invoke("text")
			.then(quoteContent => {
				cy.get("@randomQuoteContent").should("be.equal", quoteContent);
			});
		cy.get("@quotesList")
			.find("figcaption")
			.first()
			.invoke("text")
			.then(quoteAuthor => {
				cy.get("@randomQuoteAuthor").should("be.equal", quoteAuthor);
			});
	});

	it("completely hides the random quote card when the user clicks on 'dismiss'", () => {
		cy.get("[data-testid='random-quote-content']").should("exist");
		cy.get("[data-testid='random-quote-dismiss-button']").click();
		cy.get("[data-testid='random-quote-card']").should("not.exist");
	});
});
