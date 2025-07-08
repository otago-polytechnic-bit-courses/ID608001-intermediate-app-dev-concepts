# Week 08

## Previous Class

Link to the previous class: [Week 07](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/07-env-variables-vercel-micro-frontends.md)

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

> **Note:** The term **a11y** is a numeronym for the word **accessibility**. The number 11 represents the number of letters between the first letter "a" and the last letter "y".

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

**ARIA** (Accessible Rich Internet Applications) is a set of attributes that can be added to **HTML** elements to improve accessibility. **ARIA** attributes provide additional information about the role, state, and properties of an element.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Semantic HTML Example</title>
  </head>
  <body>
    <header role="banner" aria-label="Site Header">
      <h1>Welcome to My Website</h1>
    </header>
    <main role="main" aria-labelledby="main-content">
      <section aria-labelledby="section1">
        <p>This is a paragraph about something interesting.</p>
      </section>
      <section aria-labelledby="section2">
        <p>Here is another paragraph of text.</p>
      </section>
    </main>
  </body>
</html>
```

In the example above, the `role` attribute is used to specify the role of the element. The `aria-label` attribute is used to provide a label for the element. The `aria-labelledby` attribute is used to specify the ID of another element that labels the current element.

What is the difference `aria-label` and `aria-labelledby`?

- `aria-label` is used to provide a label for an element that does not have a visible label. It is used to provide a text alternative for the element.
- `aria-labelledby` is used to specify the ID of another element that labels the current element. It is used to provide a reference to another element that provides a label for the current element.

---

### Keyboard Navigation

**Keyboard navigation** is an important aspect of accessibility. It allows users to navigate your application using the keyboard instead of the mouse. This is especially important for users with disabilities who may not be able to use a mouse.

**Keyboard navigation** is achieved by using the `tabindex` attribute. The `tabindex` attribute specifies the order in which elements receive focus when the user presses the **Tab** key.

Here is an example of using the `tabindex` attribute:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Keyboard Navigation Example</title>
  </head>
  <body>
    <header role="banner" aria-label="Site Header">
      <h1>Welcome to My Website</h1>
    </header>
    <main role="main" aria-labelledby="main-content">
      <section aria-labelledby="section1">
        <p>This is a paragraph about something interesting.</p>
        <button tabindex="0">Click Me</button>
      </section>
      <section aria-labelledby="section2">
        <p>Here is another paragraph of text.</p>
        <button tabindex="1">Click Me Too</button>
      </section>
    </main>
  </body>
</html>
```

> **Note:** `tabindex="1"` is not recommended. It is better to use `tabindex="0"` for all elements that should be focusable. The order in which elements receive focus is determined by the order in which they appear in the HTML document.

---

### WCAG Guidelines

**WCAG** (Web Content Accessibility Guidelines) is a set of guidelines for making web content more accessible. The guidelines are organised into four principles:

1. **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive.
   - Text alternatives for non-text content
   - Captions for audio and video content
   - Adaptable content that can be presented in different ways (e.g., screen readers, braille displays)
   - Content that can be distinguished from the background (e.g., color contrast, text size)
2. **Operable**: User interface components and navigation must be operable.
   - Keyboard navigation for all interactive elements
   - Enough time to read and use content (e.g., time limits, auto-updating content)
   - No content that causes seizures (e.g., flashing content, animations)
   - Navigable content (e.g., clear navigation, headings, links)
3. **Understandable**: Information and the operation of user interface must be understandable.
   - Text that is readable and understandable (e.g., plain language, clear instructions)
   - Predictable user interface (e.g., consistent navigation, predictable behavior)
   - Input assistance (e.g., error suggestions, labels for form fields)
4. **Robust**: Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.
   - Compatible with current and future user agents (e.g., valid HTML, ARIA attributes)
   - Accessible to assistive technologies (e.g., screen readers, braille displays)
   - Support for different input methods (e.g., keyboard, mouse, touch)

> **Resource:** [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Internationalisation

**Internationalisation** (i18n) is the process of designing your application so that it can be adapted to different languages and regions without requiring changes to the source code. This is important for making your application accessible to users in different countries and regions.

---

### Setting Up Internationalisation

1. Install the **i18next** and **react-i18next** packages:

```bash
npm install i18next react-i18next
```

2. In the `src` directory, create a new file called **i18n.js**. This file will contain the configuration for **i18next**.

3. In the **i18n.js** file, add the following code:

```javascript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
    },
  },
  fr: {
    translation: {
      "Welcome to React": "Bienvenue à React et react-i18next",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

4. In the **src/main.jsx** file, import the **i18n.js** file:

```javascript
import "./i18n";
```

5. In the **src/App.jsx** file, add the following code:

```javascript
import { useTranslation } from "react-i18next";

const App = () => {
  const { t } = useTranslation();
  return <h2>{t("Welcome to React")}</h2>;
};

export default App;
```

What is the `t` function? The `t` function is a translation function provided by **i18next**. It is used to translate keys into the current language. The `t` function takes a key as an argument and returns the translated string for the current language.

Navigate to <http://localhost:5173>. You should see the text "Welcome to React and react-i18next".
If you change the language to **French**, you should see the text "Bienvenue à React et react-i18next".

--

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Convert the following **HTML** code to **React** code, i.e., create components for the **header**, **main**, and **section** elements.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Semantic HTML Example</title>
  </head>
  <body>
    <header role="banner" aria-label="Site Header">
      <h1>Welcome to My Website</h1>
    </header>
    <main role="main" aria-labelledby="main-content">
      <section aria-labelledby="section1">
        <p>This is a paragraph about something interesting.</p>
        <button tabindex="0">Click Me</button>
      </section>
      <section aria-labelledby="section2">
        <p>Here is another paragraph of text.</p>
        <button tabindex="1">Click Me Too</button>
      </section>
    </main>
  </body>
</html>
```

---

### Task Two

Implement the internationalisation code above. Create a component that allows the user to change the language of the application. The component should have a dropdown that allows the user to select the language. When the user selects a language, the application should update the text to the selected language.

---

## Next Class

Link to the next class: [Week 09](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/09-vitest-react-testing-library-cypress.md)
