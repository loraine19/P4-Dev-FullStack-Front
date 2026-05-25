/* PARCOURS 1 — Authentification (UI) */

const TS = Date.now();
const USER = {
  name: 'Cypress Auth',
  email: `cypress-auth-${TS}@test.local`,
  password: 'Password1!',
};

describe('Parcours 1 — Authentification', () => {
  it('1.1 Register → formulaire visible + inscription réussie → retour login', () => {
    // /?auth=login shows LoginForm with "Créer un compte" switch link
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    cy.get('#register-name').type(USER.name);
    cy.get('#register-email').type(USER.email);
    cy.get('#register-password').type(USER.password);
    cy.get('#register-passwordConfirm').type(USER.password);

    cy.contains('button', 'Créer un compte').click();

    // after success → onSwitch() → setSearchParams({ auth: 'login' }) → login form
    cy.get('#login-email').should('be.visible');
  });

  it('1.2 Login valide → redirigé vers /my-space', () => {
    cy.visit('/?auth=login');

    cy.get('#login-email').type(USER.email);
    cy.get('#login-password').type(USER.password);
    cy.contains('button', 'Connexion').click();

    cy.url().should('include', '/my-space');
  });

  it('1.3 Login invalide → pas de redirection + message erreur', () => {
    cy.visit('/?auth=login');

    cy.get('#login-email').type(USER.email);
    cy.get('#login-password').type('mauvais-mdp');
    cy.contains('button', 'Connexion').click();

    cy.url().should('not.include', '/my-space');
    // error callout is visible
    cy.get('section').find('[class*="callout"]').should('exist');
  });
});
