/* PARCOURS 4 -  Téléchargement via lien public (sans mot de passe) */

const TS = Date.now();
const USER = {
  name: 'Cypress Download',
  email: `cypress-dl-${TS}@test.local`,
  password: 'Password1!',
};
const FILENAME = `download-public-${TS}.txt`;

describe('Parcours 4 -  Download via lien public', () => {
  let shareToken: string;

  before(() => {
    cy.registerViaApi(USER.name, USER.email, USER.password);
    cy.task<string>('loginForTask', { email: USER.email, password: USER.password })
      .then((token) =>
        cy.task<{ shareToken: string }>('uploadTestFile', { token, filename: FILENAME }),
      )
      .then((file) => { shareToken = file.shareToken; });
  });

  it('4.1 Page download accessible + métadonnées visibles', () => {
    cy.visit(`/download/${shareToken}`);
    // metadata callout: "Fichier : filename -  x Ko"
    cy.contains(FILENAME).should('be.visible');
    // no password field (file is public)
    cy.get('#download-password').should('not.exist');
    cy.contains('button', 'Télécharger').should('be.visible');
  });

  it('4.2 Cliquer Télécharger → requête POST 200 + téléchargement déclenché', () => {
    cy.visit(`/download/${shareToken}`);

    // intercept the download API call
    cy.intercept('POST', `**/download/${shareToken}`).as('download');

    cy.contains('button', 'Télécharger').click();

    cy.wait('@download').its('response.statusCode').should('eq', 200);
  });

  it('4.3 Token invalide → message erreur (lien expiré/invalide)', () => {
    cy.visit('/download/token-invalide-000');
    cy.get('[class*="callout"]').should('exist');
    cy.contains('button', 'Télécharger').should('not.exist');
  });

  it('8.2 Lien expiré → message d\'erreur affiché', () => {
    /* Arrange -  intercept GET to simulate 410 Gone */
    cy.intercept('GET', '**/download/expired-link-test', {
      statusCode: 410,
      body: { status: 'error', message: 'Ce lien a expiré.' },
    }).as('getExpiredMeta');

    /* Act */
    cy.visit('/download/expired-link-test');
    cy.wait('@getExpiredMeta');

    /* Assert */
    cy.get('[class*="callout"]').should('exist');
    cy.contains('button', 'Télécharger').should('not.exist');
  });
});
