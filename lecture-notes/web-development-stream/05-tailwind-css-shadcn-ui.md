# Week 05

## Previous Class

Link to the previous class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/04-react-query-tanstack-query-react-hook-form.md)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-05-formative-assessment** from **week-04-formative-assessment**.

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
npm install tailwindcss @tailwindcss/vite
```

2. In the `vite.config.js` file, update the code to the following:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

3. In `src/index.css`, update the code to the following:

```css
@import "tailwindcss";
```

4. In `src/App.tsx`, update the code to the following:

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

### Visual Studio Code Extensions

Here are some useful extensions for **Tailwind CSS**:

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Tailwind Fold](https://marketplace.visualstudio.com/items?itemName=stivo.tailwind-fold)
- [Tailwind Documentation](https://marketplace.visualstudio.com/items?itemName=alfredbirk.tailwind-documentation)
- [Tailwind Config Viewer](https://marketplace.visualstudio.com/items?itemName=KalimahApps.tailwind-config-viewer)
- [Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind)

---

## Shadcn UI

**Shadcn UI** is not a component library. It is a collection of resuable components that you copy and paste into your project. It means that you do not have to install **Shadcn UI** as a dependency.

> **Note:** **Shadcn UI** requires **React** and **Tailwind CSS** to work.

1. Install the following dependencies:

```bash
npm install @types/node --save-dev
npm install @vitejs/plugin-react
```

It will allow you to import `path` without any errors.

2. In `vite.config.js`, update the code to the following:

```js
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

3. In `tsconfig.json`, update the code to the following:

```json
{
  // Omitted for brevity
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

4. In `tsconfig.app.json`, update the code to the following:

```json
{
  "compilerOptions": {
    // Omitted for brevity
  },
  "include": ["src"],
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```


5. Run the following command to initialise **Shadcn UI**:

```bash
npx shadcn@latest init
```

5. You will be prompt with the following questions:

```bash
√ Which color would you like to use as the base color? » Neutral
√ How would you like to proceed? » Use --legacy-peer-deps
```

You see a new file called `components.json` in the root directory.

6. You can start adding components from **Shadcn UI** to your project. For example, you can add a button component by running the following command:

```bash
npx shadcn@latest add button
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

**Note:** `"@/components/ui/button";` will have a red squiggly line. Please ignore.

> **Resource:** <https://ui.shadcn.com/>

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Using **Shadcn UI** components, style the CRUD (create, read, update and delete) application created in last week's formative assessment. 

---

### Task Two

Using the **Shadcn UI** documentation, implement five different components.

---

## Next Class

Link to the next class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/web-development-stream/06-routing.md)
