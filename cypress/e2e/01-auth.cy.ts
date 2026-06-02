/* FLOW 1 - Auth (UI) */

const TS1 = Date.now();
const USERT1 = {
  name: 'Cypress Auth',
  email: `cypress-auth-${TS1}@test.local`,
  password: 'Password1!',
};

describe('Flow 1 - Auth', () => {
  it('1.1 Register → form visible + success → return login', () => {
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    cy.get('#register-name').type(USERT1.name);
    cy.get('#register-email').type(USERT1.email);
    cy.get('#register-password').type(USERT1.password);
    cy.get('#register-passwordConfirm').type(USERT1.password);

    cy.contains('button', 'Créer un compte').click();

    cy.get('#login').should('be.visible');
  });

  it('1.2 Email already registered → error callout', () => {
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    cy.get('#register-name').type('Autre utilisateur');
    cy.get('#register-email').type(USERT1.email);
    cy.get('#register-password').type(USERT1.password);
    cy.get('#register-passwordConfirm').type(USERT1.password);
    cy.contains('button', 'Créer un compte').click();

    cy.get('[class*="callout"]').should('exist');
  });

  it('1.3 Password < 8 characters → error inline after blur', () => {
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    cy.get('#register-password').type('short');
    cy.get('#register-password').blur();

    cy.contains('8 caractères min.').should('be.visible');
  });

  it('1.4 Password confirmation different → error inline after blur', () => {
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    cy.get('#register-password').type('Password1!');
    cy.get('#register-passwordConfirm').type('AutreMdp!');
    cy.get('#register-passwordConfirm').blur();

    cy.contains('Les mots de passe ne correspondent pas').should('be.visible');
  });

  it('1.5 Valid login → redirect to /my-space', () => {
    cy.visit('/?auth=login');

    cy.get('#login-email').type(USERT1.email);
    cy.get('#login-password').type(USERT1.password);
    cy.contains('button', 'Connexion').click();

    cy.url().should('include', '/my-space');
  });

  it('1.6 Invalid login → no redirect + error message', () => {
    cy.visit('/?auth=login');

    cy.get('#login-email').type(USERT1.email);
    cy.get('#login-password').type('mauvais-mdp');
    cy.contains('button', 'Connexion').click();

    cy.url().should('not.include', '/my-space');
    cy.get('section').find('[class*="callout"]').should('exist');
  });

  it('1.7 Logout → redirect to / · protected route blocked', () => {
   cy.intercept('POST', '**/api/v1/auth/logout', {
      statusCode: 200,
      body: { status: 'success', message: 'Logged out', data: null },
    }).as('logout');
    cy.loginViaApi(USERT1.email, USERT1.password);
    cy.visit('/my-space');

    cy.get('[aria-label="Ouvrir le menu latéral"]').click({ force: true });
    cy.get('aside.my-space-sidebar').should('have.class', 'is-open');
    cy.get('button#logout-button').should('be.visible');
    cy.get('button#logout-button').click();
    cy.url({ timeout: 9000 }).should('not.include', '/my-space');

    /* the protected route blocks the return without token */
    cy.then(() => { Cypress.env('_userToken', null); });
    cy.visit('/my-space');
    cy.url({ timeout: 8000 }).should('not.include', '/my-space');
  });
});
