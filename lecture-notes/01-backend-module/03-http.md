# 03: HTTP

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `03-playground`. Checkout to the `03-playground` branch and open the repository in **Visual Studio Code**.

---

## Request Methods

An **HTTP request method**, i.e., `GET`, `POST`, `PUT` and `DELETE` indicates an action to be performed for a given resource.

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

In **ID607001: Introductory Application Development Concepts/Pia o Te Taupānga Tukutuku**, you would have encountered a **CORS** error at least once. View this video to learn more about how **CORS** works - <https://www.youtube.com/watch?v=4KHiSt0oLJ0>.

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

**Note:** In **Assessment 1: Node.js Restful API - Open Trivia DB**, you will look at how to allowlist URLs using asynchronous usage.

**Resources:**

- <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS>
- <https://www.npmjs.com/package/cors>

---

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

Test the changes in **Postman** before you move on to the **Formative Assessment** section.

**Resource:** <https://www.npmjs.com/package/helmet>

---

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

## Additional Task

### Task Rua

In this task, you will create an **API** containing institution and department data. Navigate to <https://gist.github.com>. In the **Filename including extension...** input, type `institutions.json`. In the window below, add the following:

```json
{
    "name": "Otago Polytechnic",
    "region": "Otago",
    "country": "New Zealand"
}
```

Click the **Add file** button and repeat the same process but for department. Click the **Create secret gist** button. Click the **Raw** button and copy the **URL**.

### Task Toru

In this task, you will fetch institution and department data from the **API** you created in **Task Rua** using **Axios**. Then, you will insert the data into the `Institution` and `Department` tables. Test the changes in **Postman** before you move on to the **Code Review**.

### Code Review

Once you have completed all three tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.