# Week 07

## Previous Class

Link to the previous class: [Week 06](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s1-25/lecture-notes/06-routing.md)

---

## Before We Start

Open your repository in **Visual Studio Code**. Create a new branch called **week-07-formative-assessment** from **week-06-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

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

**Vercel**

### Vercel JSON File

In the root directory of your **Vite** project, create a new file called `vercel.json`. In the `vercel.json` file, add the following:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deployment

1. Navigate to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Login with your **GitHub** account
3. Click on the **Add New... > Project** option
4. Import a **Git** repository
5. Provide a project name, framework preset, root directory and environment variables (if applicable)
6. Click on the **Deploy** button

---

## Micro Frontends

**Micro Frontends** is an architectural style where a web application is composed of multiple smaller applications. Each smaller application is developed and deployed independently. 

---

### Setup 

Create two new **Vite** projects called **micro-frontend-one** and **micro-frontend-two**. 

In both applications, install the following dependencies:

```bash
npm install @originjs/vite-plugin-federation
npm install @vitejs/plugin-react --save-dev
```

In the **micro-frontend-two** project, install the following dependencies:

```bash
npm install concurrently --save-dev
```

The `@originjs/vite-plugin-federation` package is used to enable **Module Federation** in **Vite** and the `concurrently` package is used to run multiple commands concurrently. 

---

### Micro-Frontend One Package JSON File

In the **micro-frontend-one** project's `package.json` file, change the `script` > `dev` property to the following:

```json
"dev": "vite --port 5000 --strictPort",
```

The `dev` script will start the development server on port 5000. The `--strictPort` option will make sure that the server will not start if port 5000 is already in use.

---

### Micro-Frontend Two Package JSON File

In the **micro-frontend-two** project's `package.json` file, change the `script` > `dev` and `build` properties to the following:

```json
"dev": "vite --port 5001 --strictPort",
"build": "concurrently \"vite build --watch\" \"vite preview --port 5001 --strictPort\"",
```

The `build` script will build the application and then start a preview server on port 5001.

---

### Micro-Frontend One Vite Config File


In the **micro-frontend-one** project's `vite.config.ts` file, add the following code:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'micro-frontend-one',
      remotes: {
        micro_frontend_two: 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ["react", "react-dom"],
    }),
  ],
});
```

What is happening here?

- The `federation` plugin is used to enable **Module Federation** in **Vite**.
- The `name` property is used to specify the name of the micro frontend. This name will be used to identify the micro frontend in the application.
- The `remotes` property is used to specify the remote micro frontends that this micro frontend will consume. In this case, it is consuming the **micro-frontend-two** micro frontend.
- The `shared` property is used to specify the shared dependencies between the micro frontends. In this case, it is sharing the `react` and `react-dom` packages.

---

### Micro-Frontend Two Vite Config File

In the **micro-frontend-two** project's `vite.config.ts` file, add the following code:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'micro-frontend-two',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button.tsx',
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    target: 'esnext',
  },
});
```

What is happening here?

- The `exposes` property is used to specify the components that will be exposed by this micro frontend. In this case, it is exposing the `Button` component.
- The `build` property is used to specify the build options for the micro frontend. In this case, it is setting the target to `esnext`.

---

### Micro-Frontend Two

In the `src` folder, create a new folder called `components`. In the `components` folder, create a new file called `Button.tsx` with the following code:

```typescript
const Button = () => {
  return <button>Click Me!</button>;
};

export default Button;
```

This is a simple button component that will be exposed by the **micro-frontend-two** micro frontend.

---

### Micro-Frontend One

In the `src` > `App.tsx` file, add the following code:

```typescript
import Button from "micro_frontend_two/Button";

const App = () => {
  return (
    <>
      <h1>Hello, World!</h1>
      <Button />
    </>
  );
};

export default App;
```

Where does the `micro_frontend_two` value come from? It comes from the `remotes` > `micro_frontend_two` property in the **micro-frontend-one** project's `vite.config.ts` file. 

---

#### Run the Applications

In the **micro-frontend-one** project, run the following command:

```bash
npm run dev
```

In the **micro-frontend-two** project, run the following command:

```bash
npm run build
```

Navigate to `http://localhost:5000` in your browser. You should see "Hello, World!" and a button that says "Click Me!".

Make an update to the **micro-frontend-two** project. For example, change the button text to "Click Me Again!".

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One

Create a new **Vite** project called **micro-frontend-three**. This micro-frontend will display a table of data. The data will be fetched from a public API. You can use any public API you like. For example, you can use the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API. 

In the **micro-frontend-one** project, add the **micro-frontend-three** micro frontend as a remote and render the table of data in the **micro-frontend-one** project.

---

## Next Class

Link to the next class: [Week 08](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/s1-25/lecture-notes/)
