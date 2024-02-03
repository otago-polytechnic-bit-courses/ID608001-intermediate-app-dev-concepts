# 09: Tailwind CSS and Shadcn UI

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## Preparation

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
npm install tailwindcss postcss autoprefixer --save-dev
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

4. In `src/index.css`, update the code to the following:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. In `src/App.jsx`, update the code to the following:

```jsx
const App = () => {
  return <h1 className="text-3xl font-bold underline">Hello, world!</h1>;
};

export default App;
```

**Resource:** [Tailwind CSS](https://tailwindcss.com/)

## Shadcn UI

Unlike **Reactstrap**, **Shadcn UI** is not a component library. It is a collection of resuable components that you copy and paste into your project. It means that you do not have to install **Shadcn UI** as a dependency.

1. Install the following dependency:

```bash
npm install @types/node --save-dev
```

It will allow you to import `path` without any errors.

2. In `vite.config.js`, update the code to the following:

```js
import path from "path";
import react from "@vitejs/plugin-react";
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

3. Run the following command to initialise **Shadcn UI**:

```bash
npx shadcn-ui@latest init
```

4. You will be prompt with the following questions:

```bash
√ Would you like to use TypeScript (recommended)? ... no
√ Which style would you like to use? » Default
√ Which color would you like to use as base color? » Slate
√ Where is your global CSS file? ... src/index.css
√ Are you using a custom tailwind prefix eg. tw-? (Leave blank
if not) ...
√ Where is your tailwind.config.js located? ... tailwind.config.js
√ Configure the import alias for components: ... @/components
√ Configure the import alias for utils: ... @/lib/utils
√ Are you using React Server Components? ... no
√ Write configuration to components.json. Proceed? ... yes
```

You see a new file called `components.json` in the root directory.

5. In `src/App.jsx`, update the code to the following:

```jsx
import { Button } from "@/components/ui/button";

const App = () => {
  return <Button>Click Me!</Button>;
};

export default App;
```

**Resource:** [Shadcn UI](https://ui.shadcn.com/)

# Formative Assessment

Before you start, create a new branch called **09-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task Tahi

## Task Rua

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.