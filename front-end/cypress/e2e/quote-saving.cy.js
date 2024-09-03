describe( "Saving feature", () => {
  it( "shows the newly saved quote at the top of the list", () => {
    const quote = {
      content: `This is a new quote [${Date.now().toString()}]`,
      author: "Ipse"
    };

    cy.visit( "/" );
    cy.get( "[data-testid='login-form']" ).as( "login-form" );
    cy.get( "@login-form" ).find( "input[name='email']" ).type( Cypress.env( "userEmail" ) );
    cy.get( "@login-form" ).find( "input[name='password']" ).type( Cypress.env( "userPassword" ) );
    cy.get( "@login-form" ).find( "button[type='submit']" ).click();
    
    cy.get( "[data-testid='quote-form']" ).as( "quote-form" );
    cy.get( "@quote-form" ).should( "exist" );
    cy.get( "@quote-form" ).find( "textarea" ).type( quote.content );
    cy.get( "@quote-form" ).find( "input[name='author']" ).type( quote.author );
    cy.get( "@quote-form" ).find( "button[type='submit']" ).click();

    cy.get( "[data-testid='quotes-list']" ).as( "quotes-list" );
    cy.get( "@quotes-list" ).should( "exist" );
    cy.get( "@quotes-list" ).find( "blockquote" ).first().should( "have.text", quote.content );
    cy.get( "@quotes-list" ).find( "figcaption" ).first().should( "have.text", quote.author );
  });
});