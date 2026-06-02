/* FLOW 5 - Password-protected download */

const TS5 = Date.now();
const USERT5 = {
  name: 'Cypress DlPwd',
  email: `cypress-dlpwd-${TS5}@test.local`,
  password: 'Password1!',
};
const FILENAME5 = `download-pwd-${TS5}.txt`;
const FILE_PASSWORD = 'Secret1234!';

describe('Flow 5 - Password-protected download', () => {
  let shareToken: string;

  before(() => {
    cy.registerViaApi(USERT5.name, USERT5.email, USERT5.password);
    cy.task<string>('loginForTask', { email: USERT5.email, password: USERT5.password })
      .then((token) =>
        cy.task<{ shareToken: string }>('uploadTestFile', {
          token,
          filename: FILENAME5,
          downloadPassword: FILE_PASSWORD,
        }),
      )
      .then((file) => { shareToken = file.shareToken; });
  });

  it('5.1 Download page → password field visible (protected file)', () => {
    cy.visit(`/download/${shareToken}`);
    cy.contains(FILENAME5).should('be.visible');
    cy.get('#download-password').should('be.visible');
  });

  it('5.2 Wrong password → error message', () => {
    cy.visit(`/download/${shareToken}`);

    cy.intercept('POST', `**/download/${shareToken}`).as('download');

    cy.get('#download-password').type('mauvais-mdp');
    cy.contains('button', 'Télécharger').click();

    cy.wait('@download').its('response.statusCode').should('eq', 401);
    cy.get('[class*="callout"]').should('exist');
  });

  it('5.3 Correct password → POST 200 + download triggered', () => {
    cy.visit(`/download/${shareToken}`);

    cy.intercept('POST', `**/download/${shareToken}`).as('download');

    cy.get('#download-password').type(FILE_PASSWORD);
    cy.contains('button', 'Télécharger').click();

    cy.wait('@download').its('response.statusCode').should('eq', 200);
  });
});
