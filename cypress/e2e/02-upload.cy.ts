/* PARCOURS 2 — Upload fichier → lien de partage */

const TS = Date.now();
const USER = {
  name: 'Cypress Upload',
  email: `cypress-upload-${TS}@test.local`,
  password: 'Password1!',
};

describe('Parcours 2 — Upload fichier', () => {
  before(() => {
    // create user via API (clean setup)
    cy.registerViaApi(USER.name, USER.email, USER.password);
  });

  beforeEach(() => {
    // login via API — Cypress preserves Set-Cookie for cy.visit
    cy.loginViaApi(USER.email, USER.password);
  });

  it('2.1 Upload form visible à /upload', () => {
    cy.visit('/upload');
    cy.get('#upload-file').should('exist');
    cy.contains('button', 'Générer un lien de partage').should('exist');
  });

  it('2.2 Upload un fichier texte → redirigé vers /my-space + fichier dans la liste', () => {
    cy.visit('/upload');

    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('contenu test cypress'),
      fileName: `cypress-test-${TS}.txt`,
      mimeType: 'text/plain',
    });

    cy.contains('button', 'Générer un lien de partage').click();

    // après upload → navigate('/my-space')
    cy.url().should('include', '/my-space');
    cy.contains(`cypress-test-${TS}.txt`).should('be.visible');
  });

  it('2.3 Upload extension interdite (.exe) → erreur 400 + reste sur /upload', () => {
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
});
