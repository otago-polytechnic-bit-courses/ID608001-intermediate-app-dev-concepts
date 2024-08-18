# Week 5: Tailwind CSS and Shadcn U

## Before We Start

Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

When prompted, select the following options:

- Project name: **09-tailwind-css-and-shadcn-ui**
- Framework: **React**
- Variant: **JavaScript + SWC**

## Tailwind CSS

**Tailwind CSS** is a utility-first CSS framework. It is highly customizable and can be used to create unique designs. It is also very popular and has a large community.

1. Install the following dependency:

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

4. In the root directory, create a new file called `tsconfig.json`. In the `tsconfig.json` file, add the following code:

```json
{
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

6. In `src/App.jsx`, update the code to the following:

```jsx
const App = () => {
  return <h1 className="text-3xl font-bold underline">Hello, world!</h1>;
};

export default App;
```

**Resource:** https://tailwindcss.com/

## Shadcn UI

**Shadcn UI** is not a component library. It is a collection of resuable components that you copy and paste into your project. It means that you do not have to install **Shadcn UI** as a dependency.

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

3. In the root directory, create a new file called `tsconfig.json`. In the `tsconfig.json` file, add the following code:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

4. Run the following command to initialise **Shadcn UI**:

```bash
npx shadcn-ui@latest init
```

5. You will be prompt with the following questions:

```bash
√ Would you like to use TypeScript (recommended)? ... no
√ Which style would you like to use? » Default
√ Which color would you like to use as base color? » Slate
√ Where is your global CSS file? ... src/index.css
√ Would you like to use CSS variables for colors? ... yes
√ Are you using a custom tailwind prefix eg. tw-? (Leave blank
if not) ...
√ Where is your tailwind.config.js located? ... tailwind.config.js
√ Configure the import alias for components: ... @/components
√ Configure the import alias for utils: ... @/lib/utils
√ Are you using React Server Components? ... no
√ Write configuration to components.json. Proceed? ... yes
```

You see a new file called `components.json` in the root directory.

6. You can start adding components from **Shadcn UI** to your project. For example, you can add a button component by running the following command:

```bash
npx shadcn-ui@latest add button
```

7. In `src/App.jsx`, update the code to the following:

```jsx
import { Button } from "@/components/ui/button";

const App = () => {
  return <Button>Click Me!</Button>;
};

export default App;
```

**Resource:** <https://ui.shadcn.com/>

# Formative Assessment

Before you start, create a new branch called **09-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task Tahi

Using the **08-react-query** exemplar, replace the `button`, `form`, `input` and `table` code with **Shadcn UI** components.

![](../../resources/img/09-tailwind-css-and-shadcn-ui/formative-assessment/09-tailwind-css-and-shadcn-ui-formative-assessment-1.jpeg)

**Resources:**

- [](https://ui.shadcn.com/docs/components/button)
- [](https://ui.shadcn.com/docs/components/form)
- [](https://ui.shadcn.com/docs/components/input)
- [](https://ui.shadcn.com/docs/components/table)

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
