/* FLOW 3 - My space list and delete */

const TS3 = Date.now();
const USERT3 = {
  name: 'Cypress MySpace',
  email: `cypress-myspace-${TS3}@test.local`,
  password: 'Password1!',
};
const FILENAME3 = `myspace-file-${TS3}.txt`;
// same base name → backend renames it myspace-file-${TS}(1).txt
const FILENAME_DUP = `myspace-file-${TS3}(1).txt`;

describe('Flow 3 - My space', () => {
  let token: string;

  before(() => {
    // register + get Bearer token for Node-side upload task
    cy.registerViaApi(USERT3.name, USERT3.email, USERT3.password);
    cy.task<string>('loginForTask', { email: USERT3.email, password: USERT3.password }).then(
      (t) => { token = t; },
    );
  });

  beforeEach(() => {
    cy.loginViaApi(USERT3.email, USERT3.password);
  });

  it('3.1 /my-space accessible + uploaded file visible', () => {
    // upload via Node task (multipart Bearer) to set up test data
    cy.task('uploadTestFile', { token, filename: FILENAME3 }).then(() => {
      cy.visit('/my-space');
      cy.contains(FILENAME3).should('be.visible');
    });
  });

  it('3.2 Delete file → removed from list', () => {
    // same filename → backend auto-renames to FILENAME_DUP (myspace-file-${TS}(1).txt)
    cy.task('uploadTestFile', { token, filename: FILENAME3 }).then(() => {
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
