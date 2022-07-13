# 02: Development Workflow

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `02-playground`. Checkout to the `02-playground` branch and open the repository in **Visual Studio Code**.

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

**What is a scope?** A noun referring to functionality in your codebase, i.e., authentication. 

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

- --oneline - Display the output as one commit per line

Here is a **Git**  log example:

```bash
git log --oneline --grep feat
```

Here is a **Git**  example with multiple types:
 
```bash
git log --oneline --grep "^build\|^feat\|^style"
```

**Resource:** <https://git-scm.com/docs/git-log>

## Prettier

**Prettier** is an opinionated code formatter. You will remember using **Prettier** in **ID607001: Introductory Application Development**.

To get started, run the following command:

```bash
npm install prettier --save-dev
```

Check the `package.json` file to ensure you have installed `prettier`.

In the root directory, create a new file called `.prettierrc.json`.

In the `package.json` file, add the following scripts in the `scripts` block:

```bash
"prettier:fix": "npx prettier --write .",
"prettier:check": "npx prettier --check ."
```

In the root directory, create a new file called `.prettierignore`. In the `.prettierignore` file, add the following:

```bash
node_modules
```

**Note:** You will configure the `.prettierrc.json` file in the **Formative Assessment**.

Test these scripts before you move onto the **ESLint** section.

**Resource:** <https://prettier.io>

---

## ESLint

**ESLint** is a linter that helps you find and fix issues in your **JavaScript** code.

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
"lint:fix": "npx eslint --ext .js,.json --fix"
```

It will lint and fix all files with the extensions - `.js` and `.json`.

Test this script before you move onto the **Formative Assessment**.

**Resource:** <https://eslint.org>

---

## Formative Assessment

### Task One

Use the resource below and the following options to the `.prettierrc.json` file:

- Print width of 80 characters.
- Double quotes instead of single quotes.
- Include parentheses around a single arrow function parameter.
- Tab width of 2 spaces.

Test these options before you move onto the **Task Two**.

**Resource:** <https://prettier.io/docs/en/options>

### Task Two

Use the resource below and add the following rules to the `.eslintrc.json` file:

- Disallow multiple empty lines.
- Disallow multiple spaces.
- Disallow mixed spaces and tabs for indentation.
- Disallow unnecessary parentheses.
- Disallow trailing whitespace at the end of lines.
- Disallow unused variables.

Test these rules before you move onto the **Task Three**.

**Resource:** <https://eslint.org/docs/latest/rules>

## Additional Task

### Task Three

**Git** hook scripts help identify issues before you push your code to **GitHub**. In this task, you will look at setting up a pre-commit hook for **Prettier** and **ESLint**.

To get started, run the following command:

```bash
npm install husky lint-staged --save-dev
npx husky install
npx husky add .husky/pre-commit "lint-staged"
```

Check the `package.json` file to ensure you have installed `husky` and `lint-staged`.

The first command will install **Husky** and **Lint Staged** as development dependencies. The second command will install **Husky** and create a directory called `.husky` in the root directory. The three command will create a file called `pre-commit` in the `.husky` directory. This file tells **Husky** to look at the "lint-staged" block in the `package.json` file and run the given commands pre-commit. 

In the `package.json` file, add the following:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{js, json}": [
    "npm run prettier:fix",
    "npm run lint:fix",
    "git add"
  ]
}
```

Test this hook script before you move onto the **Code Review** section.

**Resources:**

- <https://typicode.github.io/husky>
- <https://www.npmjs.com/package/lint-staged>

### Code Review

Once you have completed all three tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge your pull request.
