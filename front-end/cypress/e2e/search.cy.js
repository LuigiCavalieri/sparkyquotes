describe("Search-by-keywords feature", () => {
	const defaultAuthorName = Cypress.env("authorDefaultName");

	beforeEach(() => {
		cy.intercept("POST", "**/quotes").as("saveQuote");
		cy.intercept("GET", "**/quotes?**").as("getQuotes");

		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();

		cy.get("[data-testid='quote-form']").as("quoteForm").should("exist");
		cy.wait("@getQuotes");
	});

	it("performs a search-by-keywords both in the quotes' content and their author field", () => {
		const quotes = [];
		const keywords = [];
		const now = Date.now();
		const testAuthor = `CYPRESS.${now}`;

		["one", "two", "third"].forEach(word => {
			const keyword = `${word}-${now}`;
			const content = `Cypress search test ${keyword}`;

			quotes.push(content);
			keywords.push(keyword);

			cy.get("@quoteForm").find("textarea").type(content);
			cy.get("@quoteForm").find("input[name='author']").type(testAuthor);
			cy.get("@quoteForm").find("button[type='submit']").click();
			cy.wait(["@saveQuote", "@getQuotes"]);
		});

		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("input[name='searchKeywords']").as("searchField").should("exist");
		cy.get("[data-testid='quotes-list']").as("quotesList").should("exist");

		cy.get("@searchField").type([keywords[1], keywords[2], `three-${now}`].join(" "));
		cy.wait(2000);
		cy.get("@quotesList").find("blockquote").its("length").should("equal", 2);
		cy.get("@quotesList")
			.find("blockquote")
			.each(element => {
				cy.wrap(element).invoke("text").should("be.oneOf", quotes);
			});

		cy.get("@searchField").focus().clear().type(testAuthor);
		cy.wait(2000);
		cy.get("@quotesList").find("blockquote").its("length").should("equal", quotes.length);
		cy.get("@quotesList")
			.find("figcaption")
			.each(element => {
				cy.wrap(element).should("have.text", testAuthor);
			});
	});

	it("resets the search field and results when the user saves a new quote", () => {
		const now = Date.now();
		const searchTestContent = `Cypress search [${now}]`;

		cy.get("@quoteForm").find("textarea").type(searchTestContent);
		cy.get("@quoteForm").find("button[type='submit']").click();
		cy.wait(["@saveQuote", "@getQuotes"]);

		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("input[name='searchKeywords']").as("searchField").should("exist");
		cy.get("[data-testid='quotes-list']").as("quotesList").should("exist");

		cy.get("@searchField").type(now);
		cy.wait(2000);
		cy.get("@quotesList").find("blockquote").its("length").should("equal", 1);
		cy.get("@quotesList").find("blockquote").should("have.text", searchTestContent);

		const resetTestContent = `Cypress reset search [${Date.now()}]`;

		cy.get("@quoteForm").find("textarea").focus().clear().type(resetTestContent);
		cy.get("@quoteForm").find("button[type='submit']").click();
		cy.wait(["@saveQuote", "@getQuotes"]);

		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("@searchField").should("have.value", "");
		cy.get("@quotesList").find("blockquote").first().should("have.text", resetTestContent);
	});

	it(`searches for anonymous quotes if the user enters '${defaultAuthorName}'`, () => {
		cy.get("input[name='searchKeywords']").as("searchField").should("exist");
		cy.get("[data-testid='quotes-list']").as("quotesList").should("exist");

		cy.get("@searchField").type(defaultAuthorName);
		cy.wait(2000);
		cy.get("@quotesList").find("figcaption").first().should("have.text", defaultAuthorName);
	});
});
