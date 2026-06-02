/* FLOW 6 - Anonymous upload (no account) · US07
 * Requires: VITE_ANONYMOUS_UPLOAD=true in the running Vite dev server
 */

const TS6 = Date.now();
const FILENAME = `anon-upload-${TS6}.txt`;

describe('Flow 6 - Anonymous upload', () => {
  it('7.1 Upload without account → share link, no history', () => {
    /* Arrange */
    cy.intercept('GET', '**/api/v1/tags', { body: { status: 'success', data: [], message: 'ok' } }).as('getTags');
    cy.clearLocalStorage();
    cy.visit('/upload');
    cy.wait('@getTags');

    /* Act */
    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('anonymous test file content'),
      fileName: FILENAME,
      mimeType: 'text/plain',
    }, { force: true });
    cy.contains('button', 'Générer un lien de partage').click();

    /* Assert */
    cy.get('[aria-label="Lien de partage"]').should('be.visible');
    cy.contains('/download/').should('be.visible');

    /* la route protégée redirige l'utilisateur non authentifié */
    cy.visit('/my-space');
    cy.url().should('not.include', '/my-space');
  });
});
