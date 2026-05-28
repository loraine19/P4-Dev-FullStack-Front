/* PARCOURS 6 -  Upload anonyme (sans compte) · US07
 * Requires: VITE_ANONYMOUS_UPLOAD=true in the running Vite dev server
 */

const TS = Date.now();
const FILENAME = `anon-upload-${TS}.txt`;

describe('Parcours 6 -  Upload anonyme', () => {
  it('7.1 Upload sans compte → lien de partage généré · pas d\'historique', () => {
    /* Arrange -  no loginViaApi, user is anonymous */
    cy.visit('/upload');

    /* Act -  upload a file without being authenticated */
    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('anonymous test file content'),
      fileName: FILENAME,
      mimeType: 'text/plain',
    });
    cy.contains('button', 'Générer un lien de partage').click();

    /* Assert -  share link displayed on the page (not navigated away) */
    cy.get('[aria-label="Lien de partage"]').should('be.visible');
    cy.contains('/download/').should('be.visible');

    /* Assert -  /my-space is protected, anonymous user is redirected */
    cy.visit('/my-space');
    cy.url().should('not.include', '/my-space');
  });
});
