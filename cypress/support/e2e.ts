import './commands';

/* reset user token before each test to prevent cross-test bleed */
beforeEach(() => {
  Cypress.env('_userToken', null);
});
