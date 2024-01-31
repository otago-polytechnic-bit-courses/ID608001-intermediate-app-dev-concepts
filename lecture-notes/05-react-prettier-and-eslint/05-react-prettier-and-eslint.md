# 05: React, Prettier and ESLint

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## Preparation

Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

When prompted, select the following options:

- Project name: **05-react-prettier-and-eslint**
- Framework: **React**
- Variant: **JavaScript + SWC**

## React

Refresh your memory on the following topics:

1. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/s1-24/lecture-notes/10-react-1
2. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/s1-24/lecture-notes/11-react-2
3. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/tree/s1-24/lecture-notes/12-react-3

**Note:** You do not need to complete the **formative assessments**. However, you are welcome to do so.

## Prettier

You are going to extend your knowledge of **Prettier**. Instead of formatting every file in your project, you can configure **Prettier** to only format files that are staged for commit.

1. Install the following package:

```bash
npm install pretty-quick --save-dev 
```

2. Add the following script to your `package.json` file:

```json
"pretty-quick": "pretty-quick --staged"
```

3. Run the following command:

```bash
npm run pretty-quick
```

## ESLint

**ESLint** is a popular **linting** tool that can be used to check your code for errors and enforce a consistent coding style. It is highly configurable and can be extended with **plugins**. When you create a new **React** project using **Create Vite App**, **ESLint** is already configured for you. However, not configured to work with **Prettier**.

1. Install the following packages:

```bash
npm install eslint eslint-config-prettier eslint-plugin-prettier prettier --save-dev 
```

2. Update your `.eslintrc.cjs` file:

```js
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'warn',
  },
}
```

3. Run the following command:

```bash
npm run lint
```

4. You should see errors and warnings. The errors and warnings are potentially fixable by updating the `lint` script in your `package.json` file:

```json
"eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0 --fix"
```

then running the following command:

```bash
npm run lint
```

## Formative Assessment

Before you start, create a new branch called **05-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task Tahi