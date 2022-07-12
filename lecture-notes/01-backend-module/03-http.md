# 03: HTTP

## Request Methods

An **HTTP request method** indicates an action to be performed for a given resource.

Here is a list of all **HTTP request methods**:

| Request Method | Description |
| -------------- | ----------- |
| GET            |             |
| HEAD           |             |
| POST           |             |
| PUT            |             |
| DELETE         |             |
| CONNECT        |             |
| OPTIONS        |             |
| TRACE          |             |
| PATCH          |             |

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods>

---

## Response Status Codes

An **HTTP response status code** indicates whether a specific **HTTP request** has been successfully performed.

There are five different **response** groups:

1. Information responses (100–199)
2. Successful responses (200–299)
3. Redirection messages (300–399)
4. Client error responses (400–499)
5. Server error responses (500–599)

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>

---

## Headers

An **HTTP header** lets the client and server pass additional information with an **HTTP request** or **response**.

There are four different **header** groups:

1. Request headers
2. Response headers
3. Representation headers
4. Payload headers

**Resource:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers>

---

## Cross-Origin Resource Sharing (CORS)

In **ID607001: Introductory Application Development Concepts**, you would have encountered a **CORS** error at least once. View this video to learn more about how **CORS** works - <https://www.youtube.com/watch?v=4KHiSt0oLJ0>

### How do you solve this problem?

To get started, run the following command:

```bash
npm install cors
```

In your **Express** server, go to the `app.js` file. In the `app.js`, import `cors`. For example:

```js
import cors from "cors";
```

Then add the following **middleware**:

```js
app.use(cors()); // Simple usage example
```

**Note:** In **Assessment 1: Node.js Restful API - Open Trivia DB**, you will look at how to whitelist URLs.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>
- <https://www.npmjs.com/package/cors>
