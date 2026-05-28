/* PARCOURS 1 -  Authentification (UI) */

const TS = Date.now();
const USER = {
  name: 'Cypress Auth',
  email: `cypress-auth-${TS}@test.local`,
  password: 'Password1!',
};

describe('Parcours 1 -  Authentification', () => {
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

  it('1.2 Email déjà enregistré → callout erreur', () => {
    /* Arrange -  USER already registered in test 1.1 */
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    /* Act */
    cy.get('#register-name').type('Autre utilisateur');
    cy.get('#register-email').type(USER.email);
    cy.get('#register-password').type(USER.password);
    cy.get('#register-passwordConfirm').type(USER.password);
    cy.contains('button', 'Créer un compte').click();

    /* Assert */
    cy.get('[class*="callout"]').should('exist');
  });

  it('1.3 Mot de passe < 8 caractères → erreur inline après blur', () => {
    /* Arrange */
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    /* Act */
    cy.get('#register-password').type('short');
    cy.get('#register-password').blur();

    /* Assert */
    cy.contains('8 caractères min.').should('be.visible');
  });

  it('1.4 Confirmation mot de passe différente → erreur inline après blur', () => {
    /* Arrange */
    cy.visit('/?auth=login');
    cy.contains('Créer un compte').click();

    /* Act */
    cy.get('#register-password').type('Password1!');
    cy.get('#register-passwordConfirm').type('AutreMdp!');
    cy.get('#register-passwordConfirm').blur();

    /* Assert */
    cy.contains('Les mots de passe ne correspondent pas').should('be.visible');
  });

  it('1.5 Login valide → redirigé vers /my-space', () => {
    cy.visit('/?auth=login');

    cy.get('#login-email').type(USER.email);
    cy.get('#login-password').type(USER.password);
    cy.contains('button', 'Connexion').click();

    cy.url().should('include', '/my-space');
  });

  it('1.6 Login invalide → pas de redirection + message erreur', () => {
    cy.visit('/?auth=login');

    cy.get('#login-email').type(USER.email);
    cy.get('#login-password').type('mauvais-mdp');
    cy.contains('button', 'Connexion').click();

    cy.url().should('not.include', '/my-space');
    // error callout is visible
    cy.get('section').find('[class*="callout"]').should('exist');
  });

  it('3.1 Déconnexion → redirigé vers / · route protégée bloquée', () => {
    /* Arrange -  login first */
    cy.loginViaApi(USER.email, USER.password);
    cy.visit('/my-space');

    /* Act -  open sidebar and click logout */
    cy.get('[aria-label="Ouvrir le menu latéral"]').click();
    cy.get('[role="complementary"]').should('have.class', 'is-open');
    cy.contains('button', 'Déconnexion').click();

    /* Assert -  redirected to home */
    cy.url().should('not.include', '/my-space');

    /* Assert -  protected route blocks re-entry */
    cy.visit('/my-space');
    cy.url().should('not.include', '/my-space');
  });
});
