# 02: Development Workflow

## Prettier

**Prettier** is an opinionated code formatter. You will remember using **Prettier** in **ID607001: Introductory Application Development**.

To get started, run the following commands:

```bash
npm install prettier --save-dev
echo {} > .prettierrc.json
```

These two commands will install **Prettier** as a development dependency and create a configuration file called `.prettierrc.json`.

In the root directory, create a new file called `.prettierignore`. In the `.prettierignore` file, add the following:

```bash
node_modules
```

In the `package.json` file, add the following scripts in the `scripts` block:

```bash
"format": "npx prettier --write .",
"format-check": "npx prettier --check ."
```

The second script minimises merge conflicts and other collaboration issues.

**Note:** You will configure the `.prettierrc.json` file in the **Formative Assessment**.

**Resource:** <https://prettier.io>

---

## ESLint

**ESLint** is a linter that helps you find and fix issues with your **JavaScript** code.

To get started, run the following commands:

```bash
npm install eslint --save-dev
npm init @eslint/config
```

These two commands will install **ESLint** as a development dependency and create a configuration file called `.eslintrc.json`.

In the `.eslintrc.json` file, you should see the following configurations:

```json
{
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"]
  }
}
```

The keys - `"semi"` and `"quotes"` are the names of rules in **ESLint**. The first value is the rule's error level and can be one of the following values:

- `"off"` or `0` - turn the rule off.
- `"warn"` or `1` - turn the rule on as a warning .
- `"error"` or `2` - turn the rule on as an error.

In the `package.json` file, add the following script in the `scripts` block:

```bash
"lint": "npx eslint . --ext .js,.json"
```

It will lint all files with the extensions - `.js` and `.json`.

**Resource:** <https://eslint.org>

---

## Formative Assessment

### Task One

Use the repository from the previous **Formative Assessment**. Create a new branch called `02-playground`. Checkout to the `02-playground` branch and open the repository in **Visual Studio Code**.

### Task Two

Use the resource below and the following options to the `.prettierrc.json` file:

- Print width of 80 characters.
- Double quotes instead of single quotes.
- Include parentheses around a single arrow function parameter.
- Tab width of 2 spaces.

**Resource:** <https://prettier.io/docs/en/options>

### Task Three

Use the resource below and add the following rules to the `.eslintrc.json` file:

- Disallow multiple empty lines.
- Disallow multiple spaces.
- Disallow mixed spaces and tabs for indentation.
- Disallow unnecessary parentheses.
- Disallow trailing whitespace at the end of lines.
- Disallow unused variables.

**Resource:** <https://eslint.org/docs/latest/rules>

### Task Four

**Git** hook scripts are useful for identifying issues before you push your code to **GitHub**. In this task, you will look at how to setup a pre-commit hook for **Prettier** and **ESLint**.

To get started, run the following command:

```bash
npm install lint-staged --save-dev
npm install husky --save-dev
```

In the `package.json` file, add the following:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{js, json}": [
    "npm run format",
    "npm run lint",
    "git add"
  ]
}
```

### Task Five

### Task Six

Once you have completed all three tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge your pull request.
