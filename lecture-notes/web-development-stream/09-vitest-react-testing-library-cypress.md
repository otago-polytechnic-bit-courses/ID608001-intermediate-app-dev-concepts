# Week 09

## Previous Class

Link to the previous class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/08-a11y-internationalisation.md)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-09-formative-assessment** from **week-08-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-09-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-09-formative-assessment
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

## Vitest

**Vitest** is a testing framework for **Vite**. It is highly configurable and can be extended with **plugins**.

> **Resource:** <https://vitest.dev>

---

## React Testing Library

**React Testing Library** is a library for testing **React** components. It is designed to test the output of your components from the perspective of the user. For example, you can test if a component renders a specific piece of text.

> The code snippets below are based on **03-state-management.md**.

1. Update `Book.tsx` and the `books` state in `BookList.tsx` to the following:

```jsx
// Book.tsx

// The first line will render the dollar sign (`$`) and `props.price` as separate text nodes,
// which can introduce unexpected whitespace or line breaks:
// <p>${props.price}</p>

// The second line correctly uses a JavaScript template string inside JSX,
// ensuring the dollar sign and the price are combined into one continuous string:
// <p>{`$${props.price}`}</p>

const Book = (props) => {
  return (
    <>
      <p>{props.name}</p>
      {/* <p>${props.price}</p> */}
      <p>{`$${props.price}`}</p>
      <button
        onClick={() =>
          props.addToCart({
            id: props.id,
            name: props.name,
            price: props.price,
          })
        }
        data-testid={`add-to-cart-${props.id}`}
      >
        Add to cart
      </button>
    </>
  );
};

export default Book;
```

```jsx
// BookList.tsx

const [books] = useState([
  { id: 1, name: "Pride and Prejudice", price: 15 },
  { id: 2, name: "1984", price: 10 },
  { id: 3, name: "Crime and Punishment", price: 15 },
  { id: 4, name: "Hamlet", price: 15 },
]);
```

2. Install the following dependencies:

```bash
npm install @testing-library/dom @testing-library/react @testing-library/user-event @types/react @types/react-dom jsdom vitest @vitest/ui --save-dev
```

3. In the `src` directory, create a new file called `App.test.tsx`.

4. Add the following code to the `App.test.tsx` file:

```javascript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("Tests", () => {
  it("should render Pride and Prejudice", () => {
    render(<App />);
    expect(screen.getByText("Pride and Prejudice"));
  });

  it("should render $10", () => {
    expect(screen.getByText("$10"));
  });
});
```

5. In the `package.json` file, add the following scripts:

```json
"test": "vitest",
"test:ui": "vitest --ui"
```

6. In the `vite.config.ts` file, add the following:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // This object
  test: {
    environment: "jsdom",
  },
});
```

7. Run each script above. For example, if you run `npm run test`, you should see the following output:

```bash
✓ src/App.test.tsx (2 tests) 
  ✓ Tests > should render Pride and Prejudice 
  ✓ Tests > should render $10
```

8. Let us look at user events. For example, a button click. In `Book.tsx`, update the `button` element to include a `data-testid` prop:

```tsx
// The first line will render the dollar sign (`$`) and `props.price` as separate text nodes,
// which can introduce unexpected whitespace or line breaks:
// <p>${props.price}</p>

// The second line correctly uses a JavaScript template string inside JSX,
// ensuring the dollar sign and the price are combined into one continuous string:
// <p>{`$${props.price}`}</p>

const Book = (props) => {
  return (
    <>
      <p>{props.name}</p>
      {/* <p>${props.price}</p> */}
      <p>{`$${props.price}`}</p>
      <button
        onClick={() =>
          props.addToCart({
            id: props.id,
            name: props.name,
            price: props.price,
          })
        }
        data-testid={`add-to-cart-${props.id}`}
      >
        Add to cart
      </button>
    </>
  );
};

export default Book;
```

A `data-testid` prop can be given to any element. It is used to identify an element in a test.

9. In `App.test.tsx`, add the following test:

```js
it("should click on the first Add to cart button", async () => {
  const button = await screen.findByTestId("add-to-cart-1"); // What happens if you change 1 to 10? Why?
  userEvent.click(button);
});
```

10. If you run `npm run test`, you should see the following output:

```bash
✓ src/App.test.tsx (3 tests) 
  ✓ Tests > should render Pride and Prejudice 
  ✓ Tests > should render $10 
  ✓ Tests > should click on the first Add to cart button
```

---

## Cypress

**Cypress** is an end-to-end testing framework. It is designed to test your application from the perspective of the user. For example, you can test if a button click triggers a specific action.

1. Install the following dependency:

```bash
npm install cypress --save-dev
```

2. Create a new script in your `package.json` file:

```json
"cypress:open": "cypress open"
```

3. In the `tsconfig.json` file, update it with the following:

```js
{
  "compilerOptions": {
    "module": "ES2015"
  },
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

4. Run the following command:

```bash
npm run cypress:open
```

5. You should see the **Cypress** window open. Click on the **E2E Testing > Not Configured** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-1.PNG)

6. Click on the **Continue** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-2.PNG)

7. Click on the **Start E2E Testing in Chrome** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-3.PNG)

8. Click on **Create new spec**.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-4.PNG)

9. Name the **spec** file `App.cy.js` and click on the **Create spec** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-5.PNG)

10. Click on the **Okay, run the spec** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-6.PNG)

11. **Cypress** will run the test and you should see the following output:

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-7.PNG)

12. You need to make sure the development server is running. If it is not, run the following command:

```bash
npx vite --host
```

Why `npx vite --host`? **Cypress** is running in a different environment to the development server. The `--host` flag allows **Cypress** to access the development server.

13. Update the `App.cy.js` file to include the following code:

```javascript
describe("Tests", () => {
  const NETWORK_ADDRESS = "<Network address>:5173/" // Copy and paste the network address. Note: localhost will not work

  it("should render Pride and Prejudice", () => {
    cy.visit(NETWORK_ADDRESS); 
    cy.contains("Pride and Prejudice").should("exist");
  });

  it("should click on the first Add to Cart button", () => {
    cy.visit(NETWORK_ADDRESS);
    cy.get('[data-testid="add-to-cart-1"]').click();
  });
});
```

> **Note:** This is the equivalent of the **React Testing Library** tests we wrote earlier.

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

## Task One

Using the completed **03-state-management** formative assessment and **React Testing Library**, write tests for the following:

- Adding **1984** and **Crime and Punishment** to the cart.
- Checking if the total number of items in the cart is 2.
- Checking if the total price of the items in the cart is 20.

---

## Next Class

Link to the next class: [Week 10](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/10-emerging-frontend-frameworks)
