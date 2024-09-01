# Week 07

## Before We Start

Open your **s2-24-intermediate-app-dev-repo-GitHub username** repository in **Visual Studio Code**. Create a new branch called **week-07-formative-assessment** from **week-06-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Read the comments in the code examples. It will help you understand where to type the code. Also, some code examples may show **TypeScript** warnings.

---

## Create a New Vite Project

1. Create a new project using **Create Vite App**:

```bash
npm init vite@latest
```

2. When prompted, select the following options:

- Project name: **week-07-formative-assessment**
- Framework: **React**
- Variant: **TypeScript + SWC**

3. Change into the project directory:

```bash
cd week-07-formative-assessment
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

## Storybook

**Storybook** is an open-source tool for developing UI components in isolation. It allows you to build components in isolation and view them in different states. It is a great tool for developing and testing components.

---

### Setup

To setup **Storybook** in your **Vite** project, run the following command:

```bash
npx sb init
```

In the `package.json` file, note all the changes, i.e., `storybook` and `build-storybook` scripts and `devDependencies` block. Also, it will create a `.storybook` in the root directory and `stories` directory in the `src` directory.

In the `src` directory, you will see files for `Button`, `Header` and `Page`. 

### Adding a Prop

We are going to add a new property called `loading` to the `Button`. In the `src/stories/Button.ts` file, update the code to the following:

```tsx
import React from 'react';
import './button.css';

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  loading = false,
  ...props
}: ButtonProps) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      disabled={loading}
      {...props}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
};
```

---

### Running Storybook

To run **Storybook**, run the following command:

```bash
npm run storybook
```

Open your browser and navigate to <http://localhost:6006>. You should see the **Storybook** interface.

---

### Building Storybook

**Storybook** can be built into a static site that can be deployed to a server. This is useful for sharing components with other developers or for showcasing your work. To build **Storybook**, run the following command:

```bash
npm run build-storybook
```

---

## Formative Assessment

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

## Task One

Implement the code above.

---

## Task Two

In the `src/stories/Button.ts` file, add the following props to the `ButtonProps` interface:

- `loadingLabel: string`. This prop will be used to display a loading label when the `loading` prop is `true`.
- `loadingLabelColor: string`. This prop will be used to set the color of the loading label.
- `labelColor: string`. This prop will be used to set the color of the label.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

