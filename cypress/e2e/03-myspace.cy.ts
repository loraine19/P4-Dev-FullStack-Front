/* PARCOURS 3 — Espace personnel : liste + suppression */

const TS = Date.now();
const USER = {
  name: 'Cypress MySpace',
  email: `cypress-myspace-${TS}@test.local`,
  password: 'Password1!',
};
const FILENAME = `myspace-file-${TS}.txt`;
// same base name → backend renames it myspace-file-${TS}(1).txt
const FILENAME_DUP = `myspace-file-${TS}(1).txt`;

describe('Parcours 3 — Espace personnel', () => {
  let token: string;

  before(() => {
    // register + get Bearer token for Node-side upload task
    cy.registerViaApi(USER.name, USER.email, USER.password);
    cy.task<string>('loginForTask', { email: USER.email, password: USER.password }).then(
      (t) => { token = t; },
    );
  });

  beforeEach(() => {
    cy.loginViaApi(USER.email, USER.password);
  });

  it('3.1 /my-space accessible + fichier uploadé visible', () => {
    // upload via Node task (multipart Bearer) to set up test data
    cy.task('uploadTestFile', { token, filename: FILENAME }).then(() => {
      cy.visit('/my-space');
      cy.contains(FILENAME).should('be.visible');
    });
  });

  it('3.2 Supprimer un fichier → disparaît de la liste', () => {
    // same filename → backend auto-renames to FILENAME_DUP (myspace-file-${TS}(1).txt)
    cy.task('uploadTestFile', { token, filename: FILENAME }).then(() => {
      cy.visit('/my-space');

      // intercept DELETE before triggering it
      cy.intercept('DELETE', '**/files/**').as('deleteFile');

      // open ContextMenu on the auto-renamed file card
      cy.contains(FILENAME_DUP)
        .closest('.file-card')
        .find('button[aria-label="Options"]')
        .click();

      cy.contains('button', 'Supprimer').click();

      // wait for the API call to complete, THEN assert
      cy.wait('@deleteFile').its('response.statusCode').should('eq', 204);
      cy.contains(FILENAME_DUP).should('not.exist');
    });
  });
});
