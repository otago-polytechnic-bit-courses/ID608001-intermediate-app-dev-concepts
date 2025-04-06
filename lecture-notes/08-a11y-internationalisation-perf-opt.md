# Week 08

## Previous Class

Link to the previous class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s1-25/lecture-notes/07-env-variables-vercel-micro-frontends.md)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-08-formative-assessment** from **week-07-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-08-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-08-formative-assessment
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

## Accessibility

**Accessibility** or **a11y** is the practice of making your application usable by as many people as possible. It is important to make your application accessible to people with disabilities.

---

### Semantic HTML

**Semantic HTML** is the use of **HTML** markup that conveys meaning about the content. It is important to use semantic **HTML** because it helps screen readers and other assistive technologies understand the content of your application. **Semantic HTML** also helps search engines understand the content of your application.

Here is an example of using non-semantic **HTML**:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Non-Semantic HTML Example</title>
  </head>
  <body>
    <div>
      <div>
        <div>
          <h1>Welcome to My Website</h1>
        </div>
      </div>
      <div>
        <div>
          <p>This is a paragraph about something interesting.</p>
        </div>
      </div>
      <div>
        <div>
          <p>Here is another paragraph of text.</p>
        </div>
      </div>
    </div>
  </body>
</html>
```

Here is an example of using semantic HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Semantic HTML Example</title>
  </head>
  <body>
    <header>
      <h1>Welcome to My Website</h1>
    </header>
    <main>
      <section>
        <p>This is a paragraph about something interesting.</p>
      </section>
      <section>
        <p>Here is another paragraph of text.</p>
      </section>
    </main>
  </body>
</html>
```

In the first example, the HTML markup does not convey any meaning about the content. In the second example, the HTML markup conveys meaning about the content. The `<header>` element indicates that it contains a header, and the `<main>` element indicates that it contains the main content of the page. The `<section>` elements indicate that they contain sections of content.

---

### ARIA

> **Resource:** [WAI-ARIA Overview](https://www.w3.org/WAI/standards-guidelines/aria/)

---

### Keyboard Navigation

**Keyboard navigation** is an important aspect of accessibility. It allows users to navigate your application using the keyboard instead of the mouse. This is especially important for users with disabilities who may not be able to use a mouse.

**Keyboard navigation** is achieved by using the `tabindex` attribute. The `tabindex` attribute specifies the order in which elements receive focus when the user presses the **Tab** key.

---

### WCAG Guidelines

> **Resource:** [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Internationalisation

---

## Performance Optimisation

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

Link to the next class: [Week 09](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s1-25/lecture-notes/)
