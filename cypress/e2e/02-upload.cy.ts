/* FLOW 2 - Upload file and share link */

const TS2 = Date.now();
const USERT2 = {
  name: 'Cypress Upload',
  email: `cypress-upload-${TS2}@test.local`,
  password: 'Password1!',
};

describe('Flow 2 - Upload file', () => {
  before(() => {
    // create userT2 via API (clean setup)
    cy.registerViaApi(USERT2.name, USERT2.email, USERT2.password);
  });

  beforeEach(() => {
    // login via API -  Cypress preserves Set-Cookie for cy.visit
    cy.loginViaApi(USERT2.email, USERT2.password);
  });

  it('2.1 Upload form visible at /upload', () => {
    cy.visit('/upload');
    cy.get('#upload-file').should('exist');
    cy.contains('button', 'Générer un lien de partage').should('exist');
  });

  it('2.2 Text file upload → redirect /my-space + file in list', () => {
    cy.visit('/upload');

    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('contenu test cypress'),
      fileName: `cypress-test-${TS2}.txt`,
      mimeType: 'text/plain',
    });

    cy.contains('button', 'Générer un lien de partage').click();

    // après upload → navigate('/my-space')
    cy.url().should('include', '/my-space');
    cy.contains(`cypress-test-${TS2}.txt`).should('be.visible');
  });

  it('2.3 Forbidden .exe upload → 400 error, stays on /upload', () => {
    cy.visit('/upload');

    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('MZ fake executable'),
      fileName: 'malware.exe',
      mimeType: 'application/octet-stream',
    });

    cy.contains('button', 'Générer un lien de partage').click();

    cy.url().should('include', '/upload');
    cy.get('[class*="callout"]').should('exist');
  });

  it('4.3 Upload with download password → lock icon on card', () => {
    /* Arrange */
    cy.visit('/upload');

    /* Act */
    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('protected file content'),
      fileName: `protected-${TS2}.txt`,
      mimeType: 'text/plain',
    });
    cy.get('#upload-password').type('Secret1234!');
    cy.contains('button', 'Générer un lien de partage').click();

    /* Assert */
    cy.url().should('include', '/my-space');
    cy.get('[aria-label="Fichier protégé"]').should('exist');
  });

  it('4.4 Upload with selected tag → tag on MySpace card', () => {
    /* Arrange */
    const tagName = `tag-up-${TS2}`;
    cy.visit('/upload');

    /* Act -  create tag and attach file */
    cy.get('#upload-tags').type(tagName);
    cy.get('[aria-label="Ajouter le tag"]').click();
    cy.get('[aria-label="Tags sélectionnés"]').contains(tagName).should('be.visible');

    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('tagged file content'),
      fileName: `tagged-${TS2}.txt`,
      mimeType: 'text/plain',
    });
    cy.contains('button', 'Générer un lien de partage').click();

    /* Assert */
    cy.url().should('include', '/my-space');
    cy.get('[aria-label="Tags"]').contains(tagName).should('be.visible');
  });
});
