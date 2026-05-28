/* CUSTOM COMMANDS */

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      loginViaApi(email: string, password: string): Chainable;
      registerViaApi(name: string, email: string, password: string): Chainable;
    }
  }
}

/*
 * loginViaApi -  uses isMobile:true to get a Bearer token in the JSON response,
 * then stores it in Cypress.env('_userToken'). The cy.visit override below
 * automatically injects it into localStorage via onBeforeLoad so that the Zustand
 * authStore initialises with isAuthenticated:true (tokenStorage reads localStorage).
 */
Cypress.Commands.add('loginViaApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: { email, password, isMobile: true },
  }).then((res) => {
    expect(res.status).to.eq(200);
    Cypress.env('_userToken', res.body.data.access_token);
  });
});

/* register via API -  failOnStatusCode:false ignores 409 if user already exists */
Cypress.Commands.add('registerViaApi', (name: string, email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/register`,
    body: { name, email, password },
    failOnStatusCode: false,
  });
});

/*
 * Override cy.visit to inject the Bearer token into localStorage before the page
 * loads. This ensures isAuthenticated:true in the Zustand store from the first render.
 * Only runs when _userToken is set (tests without loginViaApi are unaffected).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Cypress.Commands.overwrite('visit', (originalFn: any, ...args: any[]) => {
  const token: string | null = Cypress.env('_userToken');
  const url: string = args[0];
  const options: Partial<Cypress.VisitOptions> = args[1] ?? {};

  if (token) {
    const originalOnBeforeLoad = options.onBeforeLoad;
    const modified: Partial<Cypress.VisitOptions> = {
      ...options,
      onBeforeLoad(win: Cypress.AUTWindow) {
        win.localStorage.setItem('access_token', token);
        if (originalOnBeforeLoad) originalOnBeforeLoad(win);
      },
    };
    return originalFn(url, modified);
  }
  return originalFn(url, options);
});
