# 10: Vitest, React Testing Library, and Cypress

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## Preparation

Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

When prompted, select the following options:

- Project name: **10-vitest-react-testing-library-and-cypress**
- Framework: **React**
- Variant: **JavaScript + SWC**

Copy the files from the **07-state-management** exemplar project into the **10-vitest-react-testing-library-and-cypress** project.

## Vitest

**Vitest** is a testing framework for **Vite**. It is highly configurable and can be extended with **plugins**.

**Resource:** <https://vitest.dev>

## React Testing Library

**React Testing Library** is a library for testing **React** components. It is designed to test the output of your components from the perspective of the user. For example, you can test if a component renders a specific piece of text.

1. Install the following dependencies:

```bash
npm install @testing-library/dom @testing-library/jest-dom @testing-library/react @testing-library/user-event @vitest/coverage-v8 @vitest/ui jsdom vitest --save-dev
```

2. In the `src` directory, create a new file called `App.test.js`.

3. Add the following code to the `App.test.js` file:

```javascript
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("Tests", () => {
  it("should render Pride and Prejudice", () => {
    render(<App />);
    expect(screen.getByText("Pride and Prejudice")).toBeInTheDocument();
  });
});
```

4. In the `package.json` file, add the following scripts:

```json
"test": "vitest",
"test:coverage": "vitest run --coverage",
"test:ui": "vitest --ui"
```

5. Run each script above. For example, if you run `npm run test`, you should see the following output:

```bash
✓ src/App.test.jsx (1)
  ✓ Tests (1)
    ✓ should render Pride and Prejudice
```

6. Let us look at user events. For example, a button click. In `Book.jsx`, update the `button` element to include a `data-testid` prop:

```jsx
<button
  onClick={() =>
    dispatch(
      addToCart({
        id: props.id,
        name: props.name,
        price: props.price,
      })
    )
  }
  data-testid={`add-to-cart-${props.id}`}
>
  Add to cart
</button>
```
A `data-testid` prop can be given to any element. It is used to identify an element in a test.

7. In `App.test.js`, add the following test:

```js
it("should click on the first Add to cart button", () => {
  render(<App />);
  const button = screen.getByTestId("add-to-cart-1"); // What happens if you change this to 10? Why? 
  userEvent.click(button);
});
```

8. If you run `npm run test`, you should see the following output:

```bash
✓ src/App.test.jsx (2)
  ✓ Tests (2)
    ✓ should render Pride and Prejudice
    ✓ should click on the first Add to cart button
```

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

3. Run the following command:

```bash
npm run cypress:open
```

3. You should see the **Cypress** window open. Click on the **E2E Testing > Not Configured** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-1.PNG)

4. Click on the **Continue** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-2.PNG)

5. Click on the **Start E2E Testing in Chrome** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-3.PNG)

6. Click on **Create new spec**.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-4.PNG)

7. Name the **spec** file `App.cy.js` and click on the **Create spec** button.
   
![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-5.PNG)

8. Click on the **Okay, run the spec** button.

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-6.PNG)

9. **Cypress** will run the test and you should see the following output:

![](../../resources/img/10-vitest-react-testing-library-and-cypress/10-vitest-react-testing-library-and-cypress-7.PNG)

10. You need to make sure the development server is running. If it is not, run the following command:

```bash
npx vite --host
```

Why `npx vite --host`? **Cypress** is running in a different environment to the development server. The `--host` flag allows **Cypress** to access the development server. 

11. Update the `App.cy.js` file to include the following code:

```javascript
describe("Tests", () => {
  it("should render Pride and Prejudice", () => {
    cy.visit("http://192.168.68.68:5173/"); // What happens if you change this to http://localhost:5173?
    cy.contains("Pride and Prejudice").should("exist");
  });

  it("should click on the first Add to Cart button", () => {
    cy.visit("http://192.168.68.68:5173/");
    cy.get('[data-testid="add-to-cart-1"]').click();
  });
});
```

**Note:** This is the equivalent of the **React Testing Library** tests we wrote earlier.

**Resource:** <https://docs.cypress.io>

# Formative Assessment

Before you start, create a new branch called **10-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task Tahi

Using the completed **07-state-management** formative assessment and **React Testing Library**, write tests for the following:

- Adding **1984** and **Crime and Punishment** to the cart.
- Checking if the total number of items in the cart is 2.
- Checking if the total price of the items in the cart is 20.

## Task Rua

Using the completed **08-react-query** formative assessment and **Cypress**, write tests for the following:

- Adding an institution.
- Checking if the institution is added to the list of institutions.
- Updating the institution.
- Checking if the institution is updated in the list of institutions.
- Deleting the institution.
- Checking if the institution is deleted from the list of institutions.
- Clicking the **Load More** button.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
