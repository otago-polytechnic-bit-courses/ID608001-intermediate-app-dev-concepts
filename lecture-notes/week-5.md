# Week 05

## Before We Start

Open your **s2-24-intermediate-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-05-formative-assessment** from **week-04-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-05-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-05-formative-assessment
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

## Tailwind CSS

**Tailwind CSS** is a utility-first **CSS** framework. Utility first means that you can use classes to style your elements. It is highly customisable and can be used to create unique designs. It is also very popular and has a large community.

---

### Setup

1. Install the following packages:

```bash
npm install tailwindcss postcss autoprefixer @vitejs/plugin-react-swc --save-dev
```

2. Create a **Tailwind CSS** configuration file:

```bash
npx tailwindcss init -p
```

You should see a new file called `tailwind.config.js` in the root directory.

3. In the `tailwind.config.js` file, update the code to the following:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

4. In the `tsconfig.json` file, add the following code:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

5. In `src/index.css`, update the code to the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- **@tailwind base;** includes the base styles for the project. For example, you can use classes like `font-sans` to style text.
- **@tailwind components;** includes the component styles for the project. For example, you can use classes like `btn` to style buttons.
- **@tailwind utilities;** includes the utility styles for the project. For example, you can use classes like `text-blue-500` to style text.

6. In `src/App.tsx`, update the code to the following:

```jsx
const App = () => {
  return (
    <h1 className="text-3xl font-bold underline text-blue-500">
      Hello, World!
    </h1>
  );
};

export default App;
```

> **Resource:** https://tailwindcss.com/

---

## Shadcn UI

**Shadcn UI** is not a component library. It is a collection of resuable components that you copy and paste into your project. It means that you do not have to install **Shadcn UI** as a dependency.

> **Note:** **Shadcn UI** requires **React** and **Tailwind CSS** to work.

1. Install the following dependency:

```bash
npm install @types/node --save-dev
```

It will allow you to import `path` without any errors.

2. In `vite.config.js`, update the code to the following:

```js
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```


4. Run the following command to initialise **Shadcn UI**:

```bash
npx shadcn@latest init
```

5. You will be prompt with the following questions:

```bash
√ Which style would you like to use? » Default
√ Which color would you like to use as base color? » Slate
√ Would you like to use CSS variables for colors? ... yes
```

You see a new file called `components.json` in the root directory.

6. You can start adding components from **Shadcn UI** to your project. For example, you can add a button component by running the following command:

```bash
npx shadcn-ui add button
```

7. In `src/App.tsx`, update the code to the following:

```jsx
import { Button } from "@/components/ui/button";

const App = () => {
  return (
    <Button>Click Me!</Button>
  );
};

export default App;
```

> **Resource:** <https://ui.shadcn.com/>

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Using **Shadcn UI** components, style the CRUD (create, read, update and delete) application created in last week's formative assessment. 

---

### Task Two (Research)

Using the **Shadcn UI** documentation, implement a data table and date picker.

---

### Task Three (Research)

Using the **Shadcn UI** documentation, implement a line chart and pie chart.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
