describe("Search-by-keywords feature", () => {
	it("performs a search-by-keywords both in the quotes' content and their author field", () => {
		const quotes = [];
		const keywords = [];
		const now = Date.now();
		const testAuthor = `CYPRESS.${now}`;

		cy.intercept("POST", "**/quotes").as("saveQuote");
		cy.intercept("GET", "**/quotes?**").as("getQuotes");

		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();

		cy.get("[data-testid='quote-form']").as("quoteForm").should("exist");

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
		cy.wait(5000);
		cy.get("@quotesList").find("blockquote").its("length").should("equal", 2);
		cy.get("@quotesList")
			.find("blockquote")
			.each(element => {
				cy.wrap(element).invoke("text").should("be.oneOf", quotes);
			});

		cy.get("@searchField").focus().clear().type(testAuthor);
		cy.wait(5000);
		cy.get("@quotesList").find("blockquote").its("length").should("equal", quotes.length);
		cy.get("@quotesList")
			.find("figcaption")
			.each(element => {
				cy.wrap(element).invoke("text").should("equal", testAuthor);
			});
	});
});
