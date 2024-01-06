# 01: CORS, Helmet and Rate Limiting

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

**Resource:** <https://www.npmjs.com/package/helmet>

## Rate Limiting

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
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again in 15 minutes" 
});

app.use(limiter);
```

**Resource:** <https://www.npmjs.com/package/express-rate-limit>

# Refresher Exercise

Before you start, create a new branch called **01-refresher-exercise**.

## Task 1:

Refresh your memory on the following topics:

1. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-23/lecture-notes/04-postgresql-and-object-relational-mapper.md
2. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-23/lecture-notes/05-relationships.md
3. https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-23/lecture-notes/06-validation.md

**Note:** You do not need to complete the **formative assessments**. However, you are welcome to do so.