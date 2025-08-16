# Week 01

## GitHub

This course will use **GitHub** and **GitHub Classroom** to manage our development. Begin by clicking this link [https://classroom.github.com/a/L9kRZVae](https://classroom.github.com/a/L9kRZVae). You will be prompted to accept an assignment. Click on the **Accept this assignment** button. **GitHub Classroom** will create a new repository. You will use this repository to submit your formative (non-graded) and summative (graded) assessments.

---

### Development Workflow

By default, **GitHub Classroom** creates an empty repository. Firstly, you must create a **README** and `.gitignore` file. **GitHub** allows new files to be created once the repository is created.

---

### Create a README

Click the **Add file** button, then the **Create new file** button. Name your file `README.md` (Markdown), then click on the **Commit new file** button. You should see a new file in your formative assessments repository called `README.md` and the `main` branch.

> **Resource:** <https://guides.github.com/features/mastering-markdown/>

---

### Create a .gitignore File

Like before, click the **Add file** button and then the **Create new file** button. Name your file `.gitignore`. A `.gitignore` template dropdown will appear on the right-hand side of the screen. Select the **Node** `.gitignore` template. Click on the **Commit new file** button. You should see a new file in your formative assessments repository called `.gitignore`.

> **Resource:** <https://git-scm.com/docs/gitignore>

---

### Clone a Repository

Open up **Git Bash** or whatever alternative you see fit on your computer. Clone your formative assessments repository to a location on your computer using the command: `git clone <repository URL>`.

> **Resource:** <https://git-scm.com/docs/git-clone>

---

### Commit Message Conventions

You should follow the **conventional commits** convention when committing changes to your repository. A **conventional commit** consists of a **type**, **scope** and **description**. The **type** and **description** are mandatory, while the **scope** is optional. The **type** must be one of the following:
  
- **build**: Changes that affect the build system or external dependencies
- **chore**: Regular code maintenance, such as refactoring or updating dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

The **scope** is a phrase describing the codebase section affected by the change. For example, you can use the scope `javascript` if you are working on the **formative assessment** for **JavaScript**. If you are working on the **formative assessment** for **HTML**, use the scope `html`.

The **description** is a short description of the change. It should be written in the imperative mood, meaning it should be written as if you are giving a command or instruction. For example, "add a new feature" instead of "added a new feature".

Here are some examples of **conventional commits**:

- `feat(javascript): add a new feature`
- `fix(html): fix a bug`
- `docs(css): update documentation`

> **Resource:** <https://www.conventionalcommits.org/en/v1.0.0/>

---

## Before We Start

Create a new branch called **week-01-formative-assessment**.

> **Note:** There are a lot of code examples. Typing the code examples rather than copying and pasting is strongly recommended. It will help you remember the code better. Also, read the comments in the code examples. It will help you understand where to type the code.

---

## Godot 

**Godot** is an open-source game engine that provides a comprehensive set of tools for game development. It supports 2D and 3D game development and offers a user-friendly interface, making it accessible for beginners and experienced developers. Godot uses a unique scene system that allows developers to create complex game worlds using reusable components.

**Godot** uses its own scripting language called **GDScript**, which is similar to **Python**. It also supports **C#**, a node-based programming language. **Godot's** community is active, and many resources are available for learning and troubleshooting.

> **Resource:** <https://godotengine.org/>

---

## Formative Assessment

Learning to use AI tools is an important skill. While AI tools are powerful, you **must** be aware of the following:

- If you provide an AI tool with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust the AI tool's responses blindly. You **must** still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge what AI tool you have used. In the assessment's repository **README.md** file, please include what prompt(s) you provided to the AI tool and how you used the response(s) to help you with your work

---

### Task One 

Read the following articles to understand the basics of **Godot**:

- [Introduction](https://docs.godotengine.org/en/stable/getting_started/introduction/index.html)
- [Step by step](https://docs.godotengine.org/en/stable/getting_started/step_by_step/index.html)

---

### Task Two

Complete the [Your first 2D game](https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html) tutorial. This tutorial will guide you through creating a simple 2D game using **Godot**. It covers the basics of the engine, including scenes, nodes and scripting.

> **Note:** You are encouraged to use **GDScript** for this tutorial. Feel free to use **C#** if you prefer, but **GDScript** is the recommended language for beginners in **Godot**.

---

### Task Three

Complete the [Your first 3D game](https://docs.godotengine.org/en/stable/getting_started/first_3d_game/index.html) tutorial. Much like the previous tutorial, this one will guide you through creating a simple 3D game using **Godot**.

---

### Task Four

Using the completed [Your first 2D game](https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html), implement **five** additional features. These features can be anything you want, but they should improve the game. The goal is to demonstrate your understanding of **Godot** and your ability to extend an existing project.

---

## Next Class

Link to the next class: [Week 02](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/tree/s2-25/lecture-notes/game-development-stream/02-tilemap.md)
