# 02: HTTP

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

# Formative Assessment

Continue working on the **formative assessments** branch.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

## Additional Tasks

### Task Rua

In this task, you will create an **API** containing institution and department data. Navigate to <https://gist.github.com>. In the **Filename including extension...** input, type `institutions.json`. In the window below, add the following:

```json
[
  {
    "name": "Otago Polytechnic",
    "region": "Otago",
    "country": "New Zealand"
  }
]
```

Click the **Add file** button and repeat the same process but for department. Click the **Create secret gist** button. Click the **Raw** button and copy the **URL**.

### Task Toru

In this task, you will create a function called `seedData` in the `controllers/v1/base.js` file. This function will fetch institution and department data from the **API** you created in **Task Rua** using **Axios**, then insert the data into the `Institution` and `Department` tables. Create a route for the `seedData` function in the `routes/v1/institutions.js` and `routes/v1/departments.js` files. Test the changes in **Postman**.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your submission. Please don't merge your own pull request.
