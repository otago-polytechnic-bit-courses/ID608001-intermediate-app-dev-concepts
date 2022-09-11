# 02: Development Workflow

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `02-playground`. Checkout to the `02-playground` branch and open the repository in **Visual Studio Code**.

---

## Git Commit Message Conventions

Let us discuss a message convention (not a standard) adopted in the industry.

A message is broken down into five components - type, scope (optional), subject, extended description (optional) and footer (optional).

Here is a list of types:

- **build:** a build-related change, i.e., installing application dependencies.
- **chore:** a change that an end-user will not see, i.e., configuring files for but not limited to code formatting, code linting and version control.
- **feat:** a new feature or piece of functionality that an end-user will see, i.e., a register or login page.
- **fix:** a bug fix, i.e. an issue with the register or login page.
- **docs:** documentation-related change, i.e., changing the **README.md** file.
- **refactor:** something that is neither a feat nor a fix, i.e., a semantic code change.
- **style:** style-related change, i.e., formatting a file or piece of code.
- **test:** an automation test change, i.e., adding a new test file or updating an existing test file.

**What is a scope?** A noun referring to functionality in the codebase, i.e., authentication. 

You are probably wondering how I should write a message using this convention. A **Git** commit looks like this:

```bash
git commit -m "<type> (optional scope): <subject>" -m "<optional extended description>" -m "<optional footer>"
```

Here is a **Git** commit example:

```bash
git commit -m "style (login): format jsx"
```

Here is a **Git** commit example with an extended description and footer:

```bash
git commit -m "style (login): format jsx" -m "additional information" -m "pr closed #12345"
```

**When should I use an extended description?** When a message is greater than 50 characters. 

**What happens if I want to view a commit with a specific type?**

```bash
git log --oneline --grep <type>
```

`--oneline` displays the output as one commit per line.

Here is a **Git**  log example:

```bash
git log --oneline --grep feat
```

Here is a **Git**  example with multiple types:
 
```bash
git log --oneline --grep "^build\|^feat\|^style"
```

**Resource:** <https://git-scm.com/docs/git-log>

---

## Prettier

**Prettier** is an opinionated code formatter. You will remember using **Prettier** in **ID607001: Introductory Application Development**. 

In reality you only want to format staged files. The reason is because you do not want to format files that are out of scope of the feature you are working on. You can use a dependency called `pretty-quick` to achieve this.

To get started, run the following command:

```bash
npm install prettier pretty-quick --save-dev
```

Check the `package.json` file to ensure you have installed `prettier` and `pretty-quick`.

In the root directory, create a new file called `.prettierrc.json`.

In the `package.json` file, add the following scripts in the `scripts` block:

```bash
"prettier:check": "npx prettier --check .",
"prettier:write": "npx pretty-quick --staged"
```

In the root directory, create a new file called `.prettierignore`. In the `.prettierignore` file, add the following:

```bash
node_modules
```

**Note:** You will configure the `.prettierrc.json` file in the **Formative Assessment**.

Test these scripts before you move on to the **ESLint** section.

**Resources:** 

- <https://prettier.io>
- <https://www.npmjs.com/package/pretty-quick>

---

## ESLint

**ESLint** is a linter that helps you find and fix issues in the **JavaScript** code.

To get started, run the following commands:

```bash
npm install eslint --save-dev
npm init @eslint/config
```

Check the `package.json` file to ensure you have installed `eslint`.

The first command will install **ESLint** as a development dependency. The second command will prompt you with the following questions:

- How would you like to use ESLint? **To check syntax, find problems, and enforce code style**.
- What type of modules does your project use? **JavaScript modules (import/export)**.
- Which framework does your project use? **None of these**.
- Does your project use TypeScript? **No**.
- Where does your code run? **Node**.
- How would you like to define a style for your project? **Use a popular style guide**.
- Which style guide do you want to follow? **Airbnb: https://github.com/airbnb/javascript**.
- What format do you want your config file to be in? **JSON**. It is opinionated, but I recommend **JSON**.
- You will be prompt to install `eslint-config-airbnb-base` and `eslint-plugin-import` as development dependencies. Select the **Yes** option.
- Which package manager do you want to use? **npm**.

In the root directory, you should see a file called `.eslintrc.json`. In the `.eslintrc.json` file, you should see the following configurations:

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["airbnb-base"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {}
}
```

In `rules`, add the following:

```json
"import/extensions": [
  "error",
  "ignorePackages",
  {
    "js": "always"
  }
]
```

`rules` should look like this:

```json
"rules": {
  "import/extensions": [
    "error",
    "ignorePackages",
    {
      "js": "always"
    }
  ]
}
```

**Note:** This rule ignores files with the `.js` file extension when imported.

In the `package.json` file, add the following script in the `scripts` block:

```bash
"lint:check": "npx eslint ."
```

In the root directory, create a new file called `.eslintignore`. In the `.eslintignore` file, add the following:

```bash
node_modules
```

Test this script before you move on to the **Formative Assessment**. Make the appropriate changes if there are any errors.

**Resource:** <https://eslint.org>

---

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**. 

### Task Rua

Use the resource below and the following options to the `.prettierrc.json` file:

- Print width of 80 characters.
- Double quotes instead of single quotes.
- Include parentheses around a single arrow function parameter.
- Tab width of 2 spaces.
- Semicolons at the end of every statement.
- Trailing commas wherever possible.

Test these options before you move on to **Task Toru**.

**Resource:** <https://prettier.io/docs/en/options>

### Task Toru

Use the resource below and add the following rules to the `.eslintrc.json` file:

- Enforce the consistent use of either backticks, double, or single quotes. Set to off.
- Disallow multiple empty lines. Set to warning.
- Disallow multiple spaces. Set to warning.
- Disallow mixed spaces and tabs for indentation. Set to warning.
- Disallow unnecessary parentheses. Set to warning.
- Disallow trailing whitespace at the end of lines. Set to warning.
- Disallow unused variables. Set to warning.
- Require return statements to either always or never specify values. Set to warning.

You may encounter conflicts between **ESLint** and **Prettier** where one's rules are overriding the other. To avoid this, you want to include the rules in the `.prettierrc.json` file in the `.eslintrc.json` file. To do this, run the following command:

```bash
npm install eslint-plugin-prettier --save-dev
```

You need to add the following rule:

```json
"prettier/prettier": 2
```

Under the `rules` block, add the following:

```json
"plugins": ["prettier"]
```

Test these rules before you move on to **Task Whā**. Make the appropriate changes if there are any errors.

**Resource:** <https://eslint.org/docs/latest/rules>

## Additional Task

### Task Whā

**Git** hook scripts help identify issues before you push the code to **GitHub**. In this task, you will look at setting up a pre-commit hook for **Prettier** and **ESLint**.

To get started, run the following command:

```bash
npm install husky lint-staged --save-dev
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Check the `package.json` file to ensure you have installed `husky` and `lint-staged`.

The first command will install **Husky**, and **Lint Staged** as development dependencies. The second command will install **Husky** and create a directory called `.husky` in the root directory. The three commands will create a file called `pre-commit` in the `.husky` directory. This file tells **Husky** to look at the "lint-staged" block in the `package.json` file and run the given commands pre-commit. 

In the `package.json` file, add the following:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{js,json}": [
    "npm run prettier:fix",
    "npm run lint:check"
  ]
}
```

Test this hook script before you move on to the **Code Review**.

**Resources:**

- <https://typicode.github.io/husky>
- <https://www.npmjs.com/package/lint-staged>

---

## Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
