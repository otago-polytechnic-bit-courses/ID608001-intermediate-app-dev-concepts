# 08: Tailwind CSS and Shadcn UI

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## Preparation

Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

When prompted, select the following options:

- Project name: **08-tailwind-css-and-shadcn-ui**
- Framework: **React**
- Variant: **JavaScript + SWC**

## Tailwind CSS

**Tailwind CSS** is a utility-first CSS framework. It is highly customizable and can be used to create unique designs. It is also very popular and has a large community.

1. Install the following package:

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

# Formative Assessment

Before you start, create a new branch called **08-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task Tahi
