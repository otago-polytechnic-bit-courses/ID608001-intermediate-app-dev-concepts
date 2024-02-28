# 01: GitHub, Versioning, CORS, Helmet and Rate Limiting

## GitHub

In this course, we are going to use **GitHub** and **GitHub Classroom** to manage our development. Begin by clicking the following:

<https://classroom.github.com/a/XHo2mFNU>

You will use this repository for your **formative assessments** only.

## Development Workflow

By default, **GitHub Classroom** creates an empty repository. Firstly, you must create a **README** and `.gitignore` file. **GitHub** provides an option for creating new files once the repository is created.

## Create a README

Click on the **Add file** button, then the **Create new file** button. Name your file `README.md` (Markdown), then click on the **Commit new file** button. You should see a new file in your formative assessments repository called `README.md` and the `main` branch.

## Create a .gitignore File

Like before, click on the **Add file** button and then the **Create new file** button. Name your file `.gitignore`. A `.gitignore` template dropdown will appear on the right-hand side of the screen. Select the **Node** `.gitignore` template. Click on the **Commit new file** button. You should see a new file in your formative assessments repository called `.gitignore`.

**Resources:**

- <https://git-scm.com/docs/gitignore>
- <https://github.com/github/gitignore>

## Clone a Repository

Open up **Git Bash** or whatever alternative you see fit on your computer. Clone your formative assessments repository to a location on your computer using the command: `git clone <repository URL>`.

**Resource:**

- <https://git-scm.com/docs/git-clone>

## Commit Message Conventions

When committing changes to your repository, you should follow the **conventional commits** convention. A **conventional commit** consists of a **type**, **scope** and **description**. The **type** and **description** are mandatory, while the **scope** is optional. The **type** must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

The **scope** is a phrase describing the section of the codebase that is affected by the change. For example, if you are working on the **formative assessment** for **JavaScript**, you can use the scope `javascript`. If you are working on the **formative assessment** for **HTML**, you can use the scope `html`.

The **description** is a short description of the change. It should be written in the imperative mood, meaning it should be written as if you are giving a command or instruction. For example, "Add a new feature" instead of "Added a new feature".

Here are some examples of **conventional commits**:

- `feat(javascript): Add a new feature`
- `fix(html): Fix a bug`
- `docs(css): Update documentation`

**Resource:**

- <https://www.conventionalcommits.org/en/v1.0.0/>

## Versioning

**API versioning** is the process of versioning your API. It is a way to ensure that future changes to an API do not break the client. It is also a way to ensure that the client can continue to use the API even if the API changes.

There are two main ways to version an API:

1. **URL versioning** - This is where the version is included in the URL. For example, `http://api.example.com/v1/users`.

2. **Header versioning** - This is where the version is included in the header. For example, `Accept: application/vnd.example.v1+json`.

We will use **URL versioning** in this course.

Here is an example of **URL versioning** in the `app.js` file:

```js
app.use("/api/v1/institutions", /** ... */);
```

## CORS

CORS stands for **Cross-Origin Resource Sharing**. It is a mechanism that uses additional **HTTP headers** to tell a browser to let a web application running at one origin (domain) have permission to access selected resources from a server at a different origin.

A web application executes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, or port) from its own. For example, an application served from `http://domain-a.com` that loads the resource `http://domain-b.com/image.jpg` is executing a cross-origin HTTP request.

For security reasons, browsers restrict cross-origin HTTP requests initiated from scripts. For example, `XMLHttpRequest` and the **Fetch API** follow the same-origin policy. This means that a web application using those APIs can only request resources from the same origin the application was loaded from unless the response from other origins includes the right CORS headers.

This prevents a malicious script on one page from obtaining sensitive data from another page.

To get started, run the following command:

```bash
npm install cors
```

Check the `package.json` file to ensure you have installed `cors`.

In the `app.js` file, import `cors`. For example:

```js
import cors from "cors";
```

Then add the following **middleware**:

```js
app.use(cors());
```

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>
- <https://www.npmjs.com/package/cors>

## Helmet

**Helmet** is a dependency secures the application by setting various **HTTP headers**. These are an important part of **HTTP** and provide metadata about a **request** or **response**. **HTTP headers** can leak sensitive information about the application. This header informs the browser which server vendor and version you are using, i.e., **Express**. It can make the application a prime target as this information can be cross-referenced with publicly known vulnerabilities. Using the resource below, implement **Helmet**.

To get started, run the following command:

```bash
npm install helmet
```

Check the `package.json` file to ensure you have installed `helmet`.

In the `app.js` file, import `helmet`. For example:

```js
import helmet from "helmet";
```

Then add the following **middleware**:

```js
app.use(helmet());
```

Here is a more comprehensive example of **Helmet**:

```js
const setXPoweredBy = helmet({
  hidePoweredBy: true,
});

const setXContentTypeOptions = helmet({
  contentTypes: {
    nosniff: true,
  },
});

const setXFrameOptions = helmet({
  frameguard: {
    action: "deny",
  },
});

const setContentSecurityPolicy = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
    },
  },
});

app.use(setXPoweredBy);
app.use(setXContentTypeOptions);
app.use(setXFrameOptions);
app.use(setContentSecurityPolicy);
```

**Resource:** <https://www.npmjs.com/package/helmet>

## Rate Limiting

**Rate limiting** is a strategy for limiting an application's API traffic. It is a common technique used to mitigate **DDoS** attacks and other malicious behaviour originating from a single source. It can also be used to limit the number of requests a user can make to an API.

To get started, run the following command:

```bash
npm install express-rate-limit
````

Check the `package.json` file to ensure you have installed `express-rate-limit`.

In the `app.js` file, import `express-rate-limit`. For example:

```js
import rateLimit from "express-rate-limit";
```

Then add the following **middleware**:

```js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again in 15 minutes",
});

app.use(limiter);
```

**Resource:** <https://www.npmjs.com/package/express-rate-limit>

# Refresher Exercise

Before you start, create a new branch called **01-refresher-exercise**.

## Task Tahi

Refresh your memory on the following topics:

1. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-24/lecture-notes/02-express-and-postman.md
2. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-24/lecture-notes/03-deployment-and-kanban.md
3. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-24/lecture-notes/04-postgresql-and-object-relational-mapper.md
4. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-24/lecture-notes/05-relationships.md
5. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s1-24/lecture-notes/06-validation.md

**Note:** You do not need to complete the **formative assessments**. However, you are welcome to do so.
