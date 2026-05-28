/* PARCOURS 7 -  Gestion des tags · US08 */

const TS = Date.now();
const USER = {
  name: 'Cypress Tags',
  email: `cypress-tags-${TS}@test.local`,
  password: 'Password1!',
};
const TAG_NAME = `tag-cy-${TS}`;

describe('Parcours 7 -  Tags', () => {
  before(() => {
    cy.registerViaApi(USER.name, USER.email, USER.password);
  });

  beforeEach(() => {
    cy.loginViaApi(USER.email, USER.password);
  });

  it('9.1 Créer un tag via le formulaire d\'upload → visible dans la chip list', () => {
    /* Arrange */
    cy.visit('/upload');

    /* Act */
    cy.get('#upload-tags').type(TAG_NAME);
    cy.get('[aria-label="Ajouter le tag"]').click();

    /* Assert */
    cy.get('[aria-label="Tags sélectionnés"]').contains(TAG_NAME).should('be.visible');
  });

  it('9.2 Associer un tag à un upload → tag affiché sur la fiche dans MySpace', () => {
    /* Arrange */
    cy.visit('/upload');

    /* Act */
    cy.get('#upload-tags').type(TAG_NAME);
    cy.get('[aria-label="Ajouter le tag"]').click();
    cy.get('#upload-file').selectFile({
      contents: Cypress.Buffer.from('tagged file content'),
      fileName: `tagged-${TS}.txt`,
      mimeType: 'text/plain',
    });
    cy.contains('button', 'Générer un lien de partage').click();

    /* Assert */
    cy.url().should('include', '/my-space');
    cy.get('[aria-label="Tags"]').contains(TAG_NAME).should('be.visible');
  });

  it('9.3 Retirer un tag sélectionné → tag supprimé de la chip list', () => {
    /* Arrange */
    cy.visit('/upload');
    cy.get('#upload-tags').type(TAG_NAME);
    cy.get('[aria-label="Ajouter le tag"]').click();
    cy.get('[aria-label="Tags sélectionnés"]').contains(TAG_NAME).should('be.visible');

    /* Act */
    cy.get(`[aria-label="Retirer le tag ${TAG_NAME}"]`).click();

    /* Assert */
    cy.get('[aria-label="Tags sélectionnés"]').should('not.exist');
  });

  it('9.4 Tag en double (nom déjà existant côté API) → callout erreur affiché', () => {
    /* Arrange -  force a 409 from the API for a new tag name (not in userTags list) */
    cy.visit('/upload');
    cy.intercept('POST', '**/tags', {
      statusCode: 409,
      body: { status: 'error', message: 'Ce tag existe déjà.' },
    }).as('createDupTag');

    /* Act -  type a tag name that won't match existing userTags → API called → 409 */
    cy.get('#upload-tags').type(`force-dup-${TS}-zz`);
    cy.get('[aria-label="Ajouter le tag"]').click();
    cy.wait('@createDupTag');

    /* Assert */
    cy.get('[class*="callout"]').should('exist');
  });
});
