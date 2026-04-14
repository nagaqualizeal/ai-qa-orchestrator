export const buildPagePrompt = (testCases: any[]): string => {
  return `
You are generating a Playwright Page Object in TypeScript.

You MUST follow the EXACT coding pattern below.

----------------------------------

REFERENCE STRUCTURE (STRICT):

import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async loginFlow(url: string, username: string, password: string): Promise<void> {
    await this.navigate(url);
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}

----------------------------------

STRICT RULES:

1. Output ONLY TypeScript code
2. DO NOT include:
   - \`\`\`
   - \`\`\`typescript
   - export default
3. MUST use:
   - export class LoginPage
4. MUST use readonly (NOT private)
5. MUST create:
   - individual reusable methods
   - one flow method using those methods
6. DO NOT inline actions inside flow
7. Follow Playwright best practices

----------------------------------

Test Cases (for context only):
${JSON.stringify(testCases, null, 2)}

----------------------------------

Return ONLY the code.
`;
};
export const buildTestDataPrompt = (testCases: any[]): string => {
  return `
You are generating test data JSON for Playwright automation.

----------------------------------

STRICT RULES:

1. Output MUST be VALID JSON ONLY
2. DO NOT include:
   - test steps
   - actions
   - TC01 / TC02 structure
   - explanations
   - markdown

----------------------------------

OBJECTIVE:

Extract ONLY usable test data from test cases:

- url
- valid username & password
- invalid username & password
- empty values if present
- special cases if relevant

----------------------------------

EXPECTED FORMAT:

{
  "url": "https://example.com",

  "validUser": {
    "username": "user",
    "password": "pass"
  },

  "invalidUser": {
    "username": "wrong",
    "password": "wrong"
  },

  "emptyUser": {
    "username": "",
    "password": "pass"
  }
}

----------------------------------

IMPORTANT:

- Keep it SIMPLE and CLEAN
- No nested test case structure
- Only data used for automation
- Keys should be meaningful (validUser, invalidUser, etc.)

----------------------------------

Test Cases:
${JSON.stringify(testCases, null, 2)}

----------------------------------

Return ONLY JSON.
`;
};
export const buildSpecPrompt = (storyId: string): string => {
  return `
You are generating a Playwright test spec file.

----------------------------------

STRICT RULES:

1. Output ONLY TypeScript code
2. DO NOT include:
   - \`\`\`
   - \`\`\`typescript
   - explanations
3. DO NOT access test steps or TC structure

----------------------------------

IMPORTS MUST BE EXACT:

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import testData from '../test-data/${storyId}.json';

----------------------------------

TEST STRUCTURE:

test.describe('Login', () => {

  test('Valid Login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginFlow(
      testData.url,
      testData.validUser.username,
      testData.validUser.password
    );

    await expect(page).toHaveURL(/inventory/);
  });

  test('Invalid Login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.loginFlow(
      testData.url,
      testData.invalidUser.username,
      testData.invalidUser.password
    );

    await expect(page.locator('body')).toContainText('Epic sadface');
  });

});

----------------------------------

IMPORTANT:

- Use ONLY loginFlow()
- Use ONLY testData
- Keep it SIMPLE and CLEAN
- Follow Playwright best practices

----------------------------------

Return ONLY TypeScript code.
`;
};