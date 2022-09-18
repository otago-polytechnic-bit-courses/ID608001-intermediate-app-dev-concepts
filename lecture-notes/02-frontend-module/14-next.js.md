# 14: Next.js

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `14-playground`. Checkout to the `14-playground` branch and open the repository in **Visual Studio Code**.

--- 

## Client-Side Rendering vs. Server-Side Rendering

View this video to learn more about how **Server-Side Rendering** works - <https://youtube.com/Sklc_fQBmcs>.

---

## Create Next App

To get started, run the following commands:

```bash
npx create-next-app star-wars
cd star-wars
```

**Note:** You may be prompt to install `create-next-app`.

**Resource:** <https://create-react-app.dev>

---

## Getting Started

After you have created the `stars-wars` application, run the following command:

```bash
`npm run dev
```

This command will start the development server. Navigate to `http://localhost:3000` to view your `stars-wars` application. Update the `pages/index.js` file and see the results in your browser.

---

## File Structure

In the root directory, there are two directories that you need to be concerned about:

- `pages` - Associated with a route based on their file name, i.e., `pages/about.js` file is mapped to `/about`.
- `public` - Stores static assets such as images, fonts, etc. Files inside the `public` directory can then be referenced by your code starting from the base URL, i.e., `/`.

**Resource:** <https://nextjs.org/docs>

### pages/api/characters/[id].js

In the `pages/api` directory, create a new directory called `characters`. In the `characters` directory, create a new file called `[id].js`. In the `[id].js` file, add the following code:

```js
const fetchData = async (req, res) => {
  const { id } = req.query;
  const response = await fetch(`https://swapi.dev/api/people/${id}`);
  const character = await response.json();
  return res.status(200).json(character);
};

export default fetchData;
```

**What is happening?**

In **Next.js**, **API routes** allow you to create an **API** within your `star-wars` application. This is a `GET` request using the **Fetch API** to the **The Star Wars API**. 

Navigate to `http://localhost:3000/api/characters/1` to view the **API** response data.

**Resource:** <https://nextjs.org/docs/api-routes/introduction>

### pages/characters/[id].js

In the `pages` directory, create a new directory called `characters`. In the `characters` directory, create a new file called `[id].js`. In the `[id].js` file, add the following code:

```js
const Character = (props) => {
  return (
    <>
      <h1>{props.character.name}</h1>
    </>
  );
};

export const getServerSideProps = async (props) => {
  const req = await fetch(
    `http://localhost:3000/api/characters/${props.params.id}`
  );
  const data = await req.json();
  return {
    props: { character: data }, // This will be passed to the page component, i.e., Character as props
  };
};

export default Character;
```

**What is happening?**

When exporting the `getServerSideProps()` function from a page component, **Next.js** will pre-render the page component on each request using the data returned by getServerSideProps()` function.

Navigate to `http://localhost:3000/characters/1` to view the character's `name` rendered in an `<h1>` element.

**Resource:** <https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props>

---

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

### Task Rua

Test the changes before you move on to the **Code Review**.

---

## Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
