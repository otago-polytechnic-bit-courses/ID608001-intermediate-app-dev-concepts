# 04: Authentication

## Session vs. Token

View this video to learn more about how session and token authentication works - <https://www.youtube.com/watch?v=UBUNrFtufWo>

---

## JSON Web Tokens (JWT)

### Overview



To get started, run the following command:

```bash
npm install jsonwebtokens bcryptjs
```

In the `.env` file, add the following environment variables:

```bash
JWT_SECRET=P@ssw0rd123
JWT_LIFETIME=1hr
```

Your `.env` file should look like this:

```bash
PORT=3000
JWT_SECRET=P@ssw0rd123
JWT_LIFETIME=1hr
```

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

**Note:** In both `Institution` and `Department` models, add a reference to the `User` model's id.

### middleware/auth.js

In the root directory, create a new directory called `middleware`. In the `middleware` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import jwt from "jsonwebtoken";

const authRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        msg: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
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

### controllers/auth.js

In the `controllers/v1` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 *  Note: The PrismaClient code should be refactored
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(200).json({ msg: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    /**
     * Note: You could query the User table so that you
     * only select the user's name and email. However
     * deleting the password and token property from the 
     * user object is a less expensive operation
     */ 
    delete user.password;
    delete user.token;

    return res.status(201).json({
      data: user,
      msg: "User successfully registered",
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

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );

    return res.status(201).json({
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


```js
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;
    const { id } = req.user;

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

### routes/auth.js

In the `routes` directory, create a new file called `auth.js`. In the `auth.js` file, add the following code:

```js
import { Router } from "express";
const router = Router();

import { register, login } from "../controllers/auth.js";

router.route("/register").post(register);
router.route("/login").post(login);

export default router;
```

### app.js

In the `app.js` file, add the following imports:

```js
import auth from "./routes/auth.js";
import authRoute from "./middleware/auth.js";
```

Add the following route for `auth`:

```js
app.use(`${BASE_URL}/auth`, auth);
```

Update the routes for `institutions` and `departments` so that they are using the `authRoute` **middleware**:

```js
app.use(`${BASE_URL}/institutions`, authRoute, institutions);
app.use(`${BASE_URL}/departments`, authRoute, departments);
```

---

## Formative Assessment
