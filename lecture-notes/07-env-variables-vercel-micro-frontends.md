# Week 07

## Previous Class

Link to the previous class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s1-25/lecture-notes/06-routing.md)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-07-formative-assessment** from **week-06-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-07-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-07-formative-assessment
```

4. Install the project dependencies:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

6. Open your browser and navigate to <http://localhost:5173>. You should see the default **React** application.

---

## Environment Variables

Environment variables are variables that are set outside of the application. They are used to store sensitive information such as API keys, database credentials, etc. They are also used to store configuration information such as the application's environment such development, production, etc.

In a **Vite** project, you can create environment variables by creating a `.env` file in the root of the project. You can then access these environment variables in your application using `import.meta.env`.

For example, create a `.env` file in the root of the project with the following content:

```plaintext
VITE_API_KEY=1234567890
```

You can then access the `VITE_API_KEY` environment variable in your application like this:

```typescript
console.log(import.meta.env.VITE_API_KEY);
```

---

## Vercel


---

## Micro Frontends

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

---

## Next Class

Link to the next class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s1-25/lecture-notes/)
