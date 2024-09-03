describe( "Pagination feature", () => {
  it( "allows the user to navigate between pages", () => {
    cy.visit( "/" );
    cy.get( "[data-testid='login-form']" ).as( "login-form" );
    cy.get( "@login-form" ).find( "input[name='email']" ).type( Cypress.env( "userEmail" ) );
    cy.get( "@login-form" ).find( "input[name='password']" ).type( Cypress.env( "userPassword" ) );
    cy.get( "@login-form" ).find( "button[type='submit']" ).click();
    
    cy.get( "[data-testid='quote-form']" ).as( "quote-form" ).should( "exist" );

    for ( let i = 0; i < 10; i++ ) {
      const quote = {
        content: `This is a new quote [${Date.now().toString()}]`,
        author: "Ipse"
      };

      cy.get( "@quote-form").find( "textarea" ).type( quote.content );
      cy.get( "@quote-form").find( "input[name='author']" ).type( quote.author );
      cy.get( "@quote-form").find( "button[type='submit']" ).click();

      if ( i === 0 ) {
        cy.get( "[data-testid='quotes-list']" ).as( "quotes-list" ).should( "exist" );
      }

      cy.get( "@quotes-list").find( "li" ).first().find( "blockquote" ).should( "have.text", quote.content );
      cy.get( "@quotes-list").find( "li" ).first().find( "figcaption" ).should( "have.text", quote.author );
    }

    cy.get( "[data-testid='next-page-button']" ).click().wait( 4000 );
    cy.get( "@quotes-list").find( "li" ).first().invoke( "attr", "data-before" ).then( parseInt ).should( "be.greaterThan", 1 );

    cy.get( "[data-testid='prev-page-button']" ).click().should( "be.disabled" );
    cy.get( "@quotes-list").find( "li" ).first().invoke( "attr", "data-before" ).then( parseInt ).should( "equal", 1 );
  });
});