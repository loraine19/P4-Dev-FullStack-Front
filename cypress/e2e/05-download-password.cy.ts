/* PARCOURS 5 -  Téléchargement avec mot de passe */

const TS = Date.now();
const USER = {
  name: 'Cypress DlPwd',
  email: `cypress-dlpwd-${TS}@test.local`,
  password: 'Password1!',
};
const FILENAME = `download-pwd-${TS}.txt`;
const FILE_PASSWORD = 'Secret1234!';

describe('Parcours 5 -  Download fichier protégé par mot de passe', () => {
  let shareToken: string;

  before(() => {
    cy.registerViaApi(USER.name, USER.email, USER.password);
    cy.task<string>('loginForTask', { email: USER.email, password: USER.password })
      .then((token) =>
        cy.task<{ shareToken: string }>('uploadTestFile', {
          token,
          filename: FILENAME,
          downloadPassword: FILE_PASSWORD,
        }),
      )
      .then((file) => { shareToken = file.shareToken; });
  });

  it('5.1 Page download → champ mot de passe visible (fichier protégé)', () => {
    cy.visit(`/download/${shareToken}`);
    cy.contains(FILENAME).should('be.visible');
    cy.get('#download-password').should('be.visible');
  });

  it('5.2 Mauvais mot de passe → message erreur', () => {
    cy.visit(`/download/${shareToken}`);

    cy.intercept('POST', `**/download/${shareToken}`).as('download');

    cy.get('#download-password').type('mauvais-mdp');
    cy.contains('button', 'Télécharger').click();

    cy.wait('@download').its('response.statusCode').should('eq', 401);
    cy.get('[class*="callout"]').should('exist');
  });

  it('5.3 Bon mot de passe → requête POST 200 + téléchargement déclenché', () => {
    cy.visit(`/download/${shareToken}`);

    cy.intercept('POST', `**/download/${shareToken}`).as('download');

    cy.get('#download-password').type(FILE_PASSWORD);
    cy.contains('button', 'Télécharger').click();

    cy.wait('@download').its('response.statusCode').should('eq', 200);
  });
});
