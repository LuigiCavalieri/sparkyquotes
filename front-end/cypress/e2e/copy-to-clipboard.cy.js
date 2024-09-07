describe("Copy to clipboard feature", () => {
	beforeEach(() => {
		cy.intercept("POST", "**/quotes").as("saveQuote");
		cy.intercept("GET", "**/quotes?**").as("getQuotes");

		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();

		cy.get("[data-testid='quote-form']").as("quoteForm").should("exist");
	});

	it("allows the user to copy a quote to the clipboard", () => {
		const quoteToCopy = {
			content: `This is a new quote [${Date.now()}]`,
			author: "Ipse",
		};

		cy.get("@quoteForm").find("textarea").type(quoteToCopy.content);
		cy.get("@quoteForm").find("input[name='author']").type(quoteToCopy.author);
		cy.get("@quoteForm").find("button[type='submit']").click();
		cy.wait(["@saveQuote", "@getQuotes"]);
		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("[data-testid='quotes-list']")
			.should("exist")
			.find("li")
			.first()
			.find("[data-testid='copy-to-clipboard-button']")
			.click();

		cy.window()
			.its("navigator.clipboard")
			.then(clip => clip.readText())
			.should("equal", `${quoteToCopy.content}\n( ${quoteToCopy.author} )`);
	});

	it("correctly copies to the clipboard a quote without author", () => {
		const testContent = `This is a new quote without author [${Date.now()}]`;

		cy.get("@quoteForm").find("textarea").type(testContent);
		cy.get("@quoteForm").find("button[type='submit']").click();
		cy.wait(["@saveQuote", "@getQuotes"]);
		cy.wait(2000); // Gives React the time to update the UI.
		cy.get("[data-testid='quotes-list']")
			.should("exist")
			.find("li")
			.first()
			.find("[data-testid='copy-to-clipboard-button']")
			.click();

		cy.window()
			.its("navigator.clipboard")
			.then(clip => clip.readText())
			.should("equal", `${testContent}\n( ${Cypress.env("authorDefaultName")} )`);
	});
});
