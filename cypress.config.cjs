const { defineConfig } = require('cypress');

/* CYPRESS CONFIG */
const API_URL = 'http://localhost:3000/api/v1';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: true,
    screenshotOnRunFailure: true,
    allowCypressEnv: true,
    env: {
      apiUrl: API_URL,
    },
    setupNodeEvents(on) {
      on('task', {
        /* login via isMobile:true → returns Bearer token */
        async loginForTask({ email, password }) {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, isMobile: true }),
          });
          const json = await res.json();
          return json.data.access_token;
        },

        /* register via API */
        async registerForTask({ name, email, password }) {
          await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
          return null;
        },

        /* upload a text file via multipart/form-data using Bearer token */
        async uploadTestFile({ token, filename, downloadPassword }) {
          const formData = new FormData();
          const blob = new Blob(['cypress test file content'], { type: 'text/plain' });
          formData.append('file', blob, filename);
          formData.append('expirationDays', '1');
          if (downloadPassword) formData.append('downloadPassword', downloadPassword);

          const res = await fetch(`${API_URL}/files`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const json = await res.json();
          return json.data;
        },
      });
    },
  },
});

