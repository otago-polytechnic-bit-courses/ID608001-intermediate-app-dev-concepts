# 02 A: Meta Frameworks

## Next.js

# 02 B: Development Workflow

## Commitizen

**Commitizen** is a command-line tool that helps developers to write standardized and consistent commit messages in their **Git** projects. It provides a guided interface that prompts developers for the necessary information to create a well-formatted commit message that follows a specific format.

Commit messages are an essential part of the **Git** workflow as they help to communicate the changes made in a commit in a concise and readable manner. Using a consistent format and style for commit messages can improve the clarity of communication, help with team collaboration, and make it easier to track changes and maintain code.

**Commitizen** uses a conventional commit message format, which provides a set of rules and guidelines for writing commit messages. This format specifies a structured way of writing commit messages. Using this format allows developers to quickly understand the purpose and scope of a commit and helps with automated release notes and changelogs.

**Commitizen** is available as a package that can be installed globally or locally in a project. It integrates with **Git** and can be used in conjunction with other tools like **Husky** and **Git** hooks to enforce commit message standards and ensure consistency across a project.

To set up **Commitizen** in a project, you need to follow these steps:

1. Install the `commitizen` package as a dev dependency by running the following command:

```bash
npm install commitizen --save-dev
```

2. Initialise the project as a **Commitizen** adapter by running the following command:

```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

This command will install the `cz-conventional-changelog` package as a dev dependency and update the `package.json` file with the **Commitizen** configuration.

3. Add a script called `commit` to the `package.json` file that uses the `git-cz` command to launch **Commitizen**:

```bash
"scripts": {
  "commit": "git-cz"
}
```

## ESLint

**ESLint** is a popular open-source tool that analyses and reports patterns found in **JavaScript** code. It is a linter that checks code for common mistakes and enforces a consistent coding style.

**ESLint** can help identify potential errors and code smells, and it can also help ensure that code adheres to a team's style guidelines.

**ESLint** can be customised with plugins and rules to fit a specific project's needs. It can be run automatically as part of a continuous integration pipeline or integrated into a code editor to provide real-time feedback as code is being written.

**ESLint** supports the latest **ECMAScript** features and can be used with various frameworks and libraries. It is widely used in the **JavaScript** community and can help improve the quality and maintainability of **JavaScript** code.

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

**Resource:** <https://eslint.org>

## Prettier

**Prettier** is an opinionated code formatter tool. **Prettier** is designed to save developers time by removing the need to manually format code and to ensure consistent formatting across a codebase. You will remember using **Prettier** in **ID607001: Introductory Application Development**.

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

**Resources:**

- <https://prettier.io>
- <https://www.npmjs.com/package/pretty-quick>