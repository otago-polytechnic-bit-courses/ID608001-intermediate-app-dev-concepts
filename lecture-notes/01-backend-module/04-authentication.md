# 04: Authentication

**Note:** Carefully read the comments in the code examples below.

## Overview

As a developer, you ideally want to safeguard sensitive data from being accessed by unauthorised users. Only when a user has logged in or authenticated they will be able to access their data. However, authorisation goes beyond authentication. Users can have different roles and permissions, which gives them specific access. For example, an admin user can create, update and delete a resource, but a normal user can only read a resource.

## Session vs. Token

There are two common ways to authenticate a user. View this video to learn more about how session and token authentication works - <https://www.youtube.com/watch?v=UBUNrFtufWo>

---

## JSON Web Tokens (JWT)

### Overview

**JSON Web Token (JWT)** is a way to transmit information between parties as a **JSON** object securely. This information is **verified** because it is **signed** using a **secret** or **public/private key**.

To get started, run the following command:

```bash
npm install jsonwebtoken bcryptjs
```

Check the `package.json` file to ensure you have installed `jsonwebtoken` and `bcryptjs`.

In the `.env` file, add the following environment variables:

```bash
JWT_SECRET=Pazzw0rd123
JWT_LIFETIME=1hr
```

Your `.env` file should look like this:

```bash
PORT=3000
JWT_SECRET=Pazzw0rd123
JWT_LIFETIME=1hr
```

You will use the `JWT_SECRET` environment variable's value, i.e., Pazzw0rd123, to sign the **JWT**. The lifetime of the **JWT** is the `JWT_LIFETIME` environment variable's value, i.e., 1 hour.

### Schema

In the `prisma.schema` file, add the following `User` model:

```js
model User {
  id              Int           @id @default(autoincrement())
  email           String        @unique
  name            String
  password        String
  createdAt       DateTime      @default(now())
  institutions    Institution[]
  departments     Department[]
}
```

### middleware/auth.js

In the root directory, create a new directory called `middleware`. In the `middleware` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import jwt from "jsonwebtoken";

const authRoute = async (req, res, next) => {
  try {
    /**
     * The authorization request header provides information that authenticates
     * a user agent with a server, allowing access to a protected resource. The
     * information will be a bearer token, and a user agent is a middle man between
     * you and the server. An example of a user agent is Postman or a web browser
     * like Google Chrome
     */
    const authHeader = req.headers.authorization;

    /**
     * A bearer token will look something like this - Bearer <JWT>. A 
     * response containing a 403 forbidden status code and message 
     * is returned if a bearer token is not provided
     */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        msg: "No token provided",
      });
    }

    /**
     * Get the JWT from the bearer token
     */
    const token = authHeader.split(" ")[1];

    /**
     * Verify the signed JWT is valid. The first argument is the token, 
     * i.e., JWT and the second argument is the secret or public/private key
     */
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Set Request's user property to the authenticated user
     */
    req.user = payload;

    next();
  } catch (error) {
    return res.status(403).json({
      msg: "Not authorized to access this route",
    });
  }
};

export default authRoute;
```

**Note:** You will use this middleware in the `app.js` file to protect your `institutions` and `departments` routes.

**Note:** In both `Institution` and `Department` models, add a reference to the `User` model's id.

### controllers/v1/auth.js

In the `controllers/v1` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(200).json({ msg: "User already exists" });
    }

    /**
     * A salt is random bits added to a password before it is hashed. Salts
     * create unique passwords even if two users have the same passwords
     */    
    const salt = await bcryptjs.genSalt();

    /**
     * Generate a hash for a given string. The first argument 
     * is a string to be hashed, i.e., Pazzw0rd123 and the second 
     * argument is a salt, i.e., E1F53135E559C253
     */ 
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    /**
     * Delete the password property from the user object. It
     * is a less expensive operation than querying the User 
     * table to retrieve the only user's email and name
     */ 
    delete user.password;

    return res.status(201).json({
      msg: "User successfully registered",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user.email) {
      return res.status(401).json({ msg: "Invalid email" });
    }

    /**
     * Compare the given string, i.e., Pazzw0rd123, with the given 
     * hash, i.e., user's hashed password
     */ 
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    /**
     * Return a JWT. The first argument is the payload, i.e., an object containing
     * the authenticated user's id and name, the second argument is the secret 
     * or public/private key, and the third argument is the lifetime of the JWT
     */ 
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );

    return res.status(200).json({
      msg: "User successfully logged in",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { register, login };
```

### controllers/v1/institutions.js

In the `controllers/v1/institutions.js` file, update the `createInstitution` function:

```js
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;

    /**
     * Get the authenticated user's id from the Request's user property
     */ 
    const { id } = req.user;

    /**
     * Now you will know which authenticated user created which institution
     */ 
    await prisma.institution.create({
      data: { name, region, country, id },
    });

    const newInstitutions = await prisma.institution.findMany({
      include: {
        departments: true,
      },
    });

    return res.status(201).json({
      msg: "Institution successfully created",
      data: newInstitutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

### routes/v1/auth.js

In the `routes/v1` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import { Router } from "express";
const router = Router();

import { register, login } from "../controllers/v1/auth.js";

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
```

### app.js

In the `app.js` file, add the following imports:

```js
import auth from "./routes/v1/auth.js";
import authRoute from "./middleware/auth.js";
```

Add the following route for `auth`:

```js
app.use(`${BASE_URL}/${CURRENT_VERSON}/auth`, auth);
```

Update the routes for `institutions` and `departments` so that they are using the `authRoute` **middleware**:

```js
app.use(`${BASE_URL}/${CURRENT_VERSON}/institutions`, authRoute, institutions);
app.use(`${BASE_URL}/${CURRENT_VERSON}/departments`, authRoute, departments);
```

**Resources:**

- https://jwt.io/introduction
- https://www.npmjs.com/package/jsonwebtoken
- https://www.npmjs.com/package/bcryptjs

---

## Formative Assessment
