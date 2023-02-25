# 02 A: Meta Frameworks

## Next.js

**Next.js** is a popular open-source framework for building **server-side rendered (SSR)** **React** applications. It provides many features out-of-the-box, including automatic code splitting, server-side rendering, static site generation, and more.

With **Next.js**, you can build modern web applications that are optimized for performance, scalability, and SEO. It also provides a seamless development experience with hot reloading, easy setup, and integrated **API** routes.

**Next.js** is commonly used for building complex web applications, e-commerce sites, blogs, and more. It is widely adopted by developers because it simplifies the development process and allows them to focus on building the application's features rather than configuring the build environment.

To get started, run the following command:

```bash
npx create-next-app 02-example
```

You will be prompt with the following options:

```bash
√ Would you like to use TypeScript with this project? No
√ Would you like to use ESLint with this project? Yes
√ Would you like to use `src/` directory with this project? No
√ Would you like to use experimental `app/` directory with this project? No
√ What import alias would you like configured? @/*
```

Change directory to `02-example`. You will be refactor some of the code.

Install **axios** using the following command:

```bash
npm install axios
```

In the **root**, create a new directory called `components`. In the `components` directory, create a new file called `UsersTable.js`. In `UsersTable.js`, add the following code:

```jsx
const UsersTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
```

**What is this code doing?**

This code defines a **functional component** called `UsersTable`. This **component** takes a single **prop** called `data`, which is an **array** of **objects** representing users. The component renders a table with two columns - **Name** and **Email**. The `data` **prop** is used to generate rows in the table, with each object in the `data` **array** representing a row.

The `map` method is used to iterate over each `object` in the `data` **array** and generate a `table` row for each user. The `key` prop is set to the `id` property of each user **object** to ensure efficient rendering of the `table` rows.

Finally, the `UsersTable` **component** is exported as the default export of the module.

In `pages/index.js`, replace the existing code with the following:

```jsx
import axios from "axios";

import UsersTable from "@/components/UsersTable";

const Home = ({ users }) => {
  return (
    <>
      <h1>Users</h1>
      <UsersTable data={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  const usersRes = await axios.get("https://jsonplaceholder.typicode.com/users");
  return {
    props: {
      users: usersRes.data,
    },
  };
};

export default Home;
```

**What is this code doing?**

This code imports the `axios` library for making **HTTP** requests and the `UsersTable` component. It then defines a **functional** **component** called `Home` that renders a heading and the `UsersTable` **component** with `data` passed as `props`.

The `getServerSideProps` **function** is a special **function** in **Next.js** that is called on the **server-side** during the rendering process. This function makes an **HTTP** **GET** request to the `https://jsonplaceholder.typicode.com/users` **API** and retrieves a list of users. It then returns an **object** with a `props` key that contains the users data as its value.

Finally, the `Home` component is exported as the **default** **component** of this module.

In the `pages` directory, create a new file called `[id].js`. In `[id.js]`, add the following code:

```jsx
import axios from "axios";
import { useRouter } from "next/router";

import UsersTable from "@/components/UsersTable";

const User = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <h1>User {id}</h1>
      <UsersTable data={[user]} />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  const userRes = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return {
    props: {
      user: userRes.data,
    },
  };
};

export default User;
```

**What is this code doing?**

This code defines a **Next.js** **page** **component** called `User`. This component renders a page that displays information about a single user.

The component imports the **axios** library and the `useRouter` hook from the **Next.js** **router**. It also imports a **component** called `UsersTable` from the **components** directory.

The `User` **component** takes a prop called `user`, which represents the `user` **object** to be displayed on the page. The component extracts the `id` parameter from the router query object using the `useRouter` **hook**.

The `getServerSideProps` **function** fetches the user data from the `https://jsonplaceholder.typicode.com/users` **API** based on the `id` parameter in the `context.params` **object**.

The `User` **component** is exported as the default export of the module, which means it can be imported and used in other parts of the application. When the `User` page is rendered, it displays the user's name and email address in a table using the `UsersTable` **component**.

In `_app.js`, remove the following line of code:

```jsx
import '@/styles/globals.css';
```

Run the application using the following command:

```bash
npm run dev
``` 

Navigate to http://localhost:3000/ and http://localhost:3000/1

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

# Formative Assessment

Before you start, create a new branch called **01-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task 1:

## Task 2:

## Task 3:

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please don't merge your own pull request.
````
