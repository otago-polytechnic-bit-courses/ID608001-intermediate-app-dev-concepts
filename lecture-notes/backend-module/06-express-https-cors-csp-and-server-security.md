# 06: Express, HTTPS, CORS, CSP and Server Security

## Express

**Express** is a web application framework for **Node.js**. It is designed for building web applications and APIs. It has been called the de facto standard server framework for **Node.js**. We will use **Express** alongside **Node Package Manager (NPM)** to build a **REST API**.

### Getting Started

```bash
npm init -y
npm install express
npm install nodemon --save-dev
```

What is the purpose of each command?

- `npm init -y`: Initializes a **Node.js** project. The `-y` flag is used to accept the default values.
- `npm install express`: Installs the **Express** module.
- `npm install nodemon --save-dev`: Installs the **Nodemon** module. The `--save-dev` flag is used to save the module as a development dependency. A development dependency is a module that is only required during development. It is not required in production.

In the `package.json` file, add the following line to the `scripts` block

```json
"dev": "nodemon index.js"
```

What is the purpose of the `dev` script? Used to start the server in development mode. The `nodemon` module is used to restart the server automatically when changes are made to the code.

Also, add the following line under the `scripts` block.

```json
"type": "module"
```

What is the purpose of the `type` property? Used to enable **ES6** module syntax. For example, `import` and `export` statements.

---

Create a file named `index.js` in the root directory and add the following code.

```javascript
// Import the Express module
import express from 'express';

// Create an Express application
const app = express();

// Create a GET route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});

// Export the Express application. May be used by other modules. For example, API testing
export default app;
```

In the terminal, run the following command.

```bash
npm run dev
```

Open a browser and navigate to `http://localhost:3000/`. You should see the following message.

```bash
Hello, World!
```

---

Let us do some refactoring. 

In the root directory, create a directory named `controllers`. In the `controllers` directory, create a file named `index.js` and add the following code.

```javascript
// Create a GET route
const get = (req, res) => { 
  res.send('Hello, World!');
};

// Export the get function
export { get };
```

What `req` and `res`? `req` is an object that contains information about the HTTP request. `res` is an object that contains information about the HTTP response.

What is the purpose of exporting the `get` function? To make it accessible to other modules. For example, the `index.js` file in the `routes` directory.

In the root directory, create a directory named `routes`. In the `routes` directory, create a file named `index.js` and add the following code.

```javascript
// Import the Express module
import express from 'express';

// Import the index controllers module
import { get } from "../controllers/index.js";

// Create an Express router
const router = express.Router();

// Create a GET route
router.get("/", get);

// Export the router
export default router;
```

In the `index.js` file, update with the following code.

```javascript
// Import the Express module
import express from 'express';

// Import the index routes module
import indexRoutes from './routes/index.js';

// Create an Express application
const app = express();

// Use the routes module
app.use('/', indexRoutes);

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});

// Export the Express application. Other modules may use it. For example, API testing
export default app;
```

Your file structure should look something like this.

```bash
.
├── controllers
│   └── index.js
├── node_modules
├── routes
│   └── index.js
├── index.js
├── package-lock.json
├── package.json
```

Why have we separated the **routes** and **controllers**? 

It is to follow the **Single Responsibility Principle (SRP)**. The **SRP** states that every module, class, or function should have responsibility over a single part of the functionality provided by the software application and that the class, module, or function should entirely encapsulate responsibility. All its services should be narrowly aligned with that responsibility.

## HTTPS

### Request Methods

An **HTTP request method** is a **verb** that indicates the desired action to be performed for a given resource. For example, the `GET` method requests a representation of the specified resource.

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods>

### Response Status Codes

An **HTTP response status code** indicates whether a specific **HTTP request** has been successfully completed. Responses are grouped in five classes:

1. Information responses (100–199)
2. Successful responses (200–299)
3. Redirection messages (300–399)
4. Client error responses (400–499)
5. Server error responses (500–599)

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>

### Headers

An **HTTP header** is a **header** that is sent at the beginning of a **request** or **response**. It contains information about the **request** or **response** and about the **client** or the **server**.

There are four different **header** groups:

1. Request headers
2. Response headers
3. Representation headers
4. Payload headers

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers>

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
  
## CSP

## Server Security

### Helmet

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

**Resource:** <https://www.npmjs.com/package/helmet>

### Rate Limiting

**Rate limiting** is a strategy for limiting an application's API traffic. It is a common technique used to mitigate **DDoS** attacks and other malicious behaviour originating from a single source. It can also be used to limit the number of requests a user can make to an API.

To get started, run the following command:

```bash
npm install express-rate-limit
```

Check the `package.json` file to ensure you have installed `express-rate-limit`.

In the `app.js` file, import `express-rate-limit`. For example:

```js
import rateLimit from "express-rate-limit";
```

Then add the following **middleware**:

```js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

**Resource:** <https://www.npmjs.com/package/express-rate-limit>

# Refresher Exercise

Before you start, create a new branch called **07-refresher-exercise**.

## Task 1:

Refresh your memory on the following topics:

1. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-23/lecture-notes/04-postgresql-and-object-relational-mapper.md
2. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-23/lecture-notes/05-relationships.md
3. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-23/lecture-notes/06-validation.md

**Note:** You do not need to complete the **formative assessments**. However, you are welcome to do so.