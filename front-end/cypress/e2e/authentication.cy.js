describe("Login feature", () => {
	beforeEach(() => {
		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").as("emailField");
		cy.get("@loginForm").find("input[name='password']").as("passwordField");
		cy.get("@loginForm").find("button[type='submit']").as("submitButton");
	});

	it("shows login form", () => {
		cy.get("@loginForm").should("exist");
	});

	it("doesn't allow to submit form with invalid email", () => {
		cy.get("@emailField").type("test@cypress");
		cy.get("@passwordField").type("test");
		cy.get("@submitButton").should("be.disabled");
	});

	it(`shows a "wrong credentials" error on providing invalid credentials`, () => {
		cy.get("@emailField").type("test@cypress.com");
		cy.get("@passwordField").type("testé");
		cy.get("@submitButton").click();
		cy.get("[data-testid='login-error-message']").contains(/password/i);
	});

	it(`hides "wrong credentials" error when the user starts typing anew or she resubmits the form`, () => {
		cy.get("@emailField").type("test@cypress.com");
		cy.get("@passwordField").type("test");
		cy.get("@submitButton").click();

		cy.get("@emailField").type("m");
		cy.get("[data-testid='login-error-message']").should("not.exist");

		cy.get("@submitButton").click();
		cy.get("[data-testid='login-error-message']").should("not.exist");
	});

	it("logs user in on providing valid credentials", () => {
		cy.get("@emailField").type(Cypress.env("userEmail"));
		cy.get("@passwordField").type(Cypress.env("userPassword"));
		cy.get("@submitButton").click();

		cy.url().should("include", "/admin/quotes");
	});

	it("allows the user to logout", () => {
		cy.intercept("POST", "**/logout").as("logoutRequest");

		cy.get("@emailField").type(Cypress.env("userEmail"));
		cy.get("@passwordField").type(Cypress.env("userPassword"));
		cy.get("@submitButton").click();

		cy.get("[data-testid='logout-button']").should("exist").click();
		cy.wait("@logoutRequest");
		cy.get("[data-testid='login-form']").should("exist");
	});
});
