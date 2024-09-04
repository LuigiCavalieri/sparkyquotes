describe("Login feature", () => {
	it("shows login form", () => {
		cy.visit("/");
		cy.get("[data-testid='login-form']").should("exist");
	});

	it("doesn't allow to submit form with invalid email", () => {
		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type("test@cypress");
		cy.get("@loginForm").find("input[name='password']").type("test");
		cy.get("@loginForm").find("button[type='submit']").should("be.disabled");
	});

	it(`shows a "wrong credentials" error on providing invalid credentials`, () => {
		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type("test@cypress.com");
		cy.get("@loginForm").find("input[name='password']").type("testé");
		cy.get("@loginForm").find("button[type='submit']").click();
		cy.get("[data-testid='login-error-message']").contains(/password/i);
	});

	it(`hides "wrong credentials" error when the user starts typing anew or she resubmits the form`, () => {
		cy.visit("/");
		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type("test@cypress.com");
		cy.get("@loginForm").find("input[name='password']").type("test");
		cy.get("@loginForm").find("button[type='submit']").click();

		cy.get("@loginForm").find("input[name='email']").type("m");
		cy.get("[data-testid='login-error-message']").should("not.exist");

		cy.get("@loginForm").find("button[type='submit']").click();
		cy.get("[data-testid='login-error-message']").should("not.exist");
	});

	it("logs user in on providing valid credentials", () => {
		cy.visit("/");

		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();

		cy.get("[data-testid='loading-screen']").should("exist");
		cy.url().should("include", "/admin/quotes");
	});

	it("allows the user to logout", () => {
		cy.visit("/");

		cy.get("[data-testid='login-form']").as("loginForm");
		cy.get("@loginForm").find("input[name='email']").type(Cypress.env("userEmail"));
		cy.get("@loginForm").find("input[name='password']").type(Cypress.env("userPassword"));
		cy.get("@loginForm").find("button[type='submit']").click();

		cy.get("[data-testid='logout-button']").should("exist").click();
		cy.get("[data-testid='login-form']").should("exist");
	});
});
