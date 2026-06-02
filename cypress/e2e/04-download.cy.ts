/* FLOW 4 - Public download link (no password) */

const TS4 = Date.now();
const USERT4 = {
  name: 'Cypress Download',
  email: `cypress-dl-${TS4}@test.local`,
  password: 'Password1!',
};
const FILENAME4 = `download-public-${TS4}.txt`;

describe('Flow 4 - Public download', () => {
  let shareToken: string;

  before(() => {
    cy.registerViaApi(USERT4.name, USERT4.email, USERT4.password);
    cy.task<string>('loginForTask', { email: USERT4.email, password: USERT4.password })
      .then((token) =>
        cy.task<{ shareToken: string }>('uploadTestFile', { token, filename: FILENAME4 }),
      )
      .then((file) => { shareToken = file.shareToken; });
  });

  it('4.1 Download page accessible + metadata visible', () => {
    cy.visit(`/download/${shareToken}`);
    cy.contains(FILENAME4).should('be.visible');
    cy.get('#download-password').should('not.exist');
    cy.contains('button', 'Télécharger').should('be.visible');
  });

  it('4.2 Click Download → POST 200 + download triggered', () => {
    cy.visit(`/download/${shareToken}`);
    cy.intercept('POST', `**/download/${shareToken}`).as('download');
    cy.contains('button', 'Télécharger').click();
    cy.wait('@download').its('response.statusCode').should('eq', 200);
  });

  it('4.3 Invalid token → error message (expired/invalid link)', () => {
    cy.visit('/download/token-invalide-000');
    cy.get('[class*="callout"]').should('exist');
    cy.contains('button', 'Télécharger').should('not.exist');
  });

  it('8.2 Expired link → error message shown', () => {
    /* Arrange */
    cy.intercept('GET', '**/api/v1/download/expired-link-test', {
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
