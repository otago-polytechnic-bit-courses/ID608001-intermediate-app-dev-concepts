# 05: Authorization

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `05-playground`. Checkout to the `05-playground` branch and open the repository in **Visual Studio Code**.

**Note:** Carefully read the comments in the code examples below.

---

## OAuth

**Open Authorization (OAuth)** is an open standard for authorization. It uses **access tokens** instead of **user credentials**, i.e., username and password to authorize applications. Also, it is known as **secure delegated access**.

**Resource:** <https://oauth.net>

---

## Basic Implementation

### Schema

In the `schema.prisma` file, add a new enum called `Role` with the values `ADMIN_USER` and `BASIC_USER`. Update the `User` to include a `role` field with the default value of `BASIC_USER`. Make sure you create a new migration.

### controllers/v1/auth.js

In the `controllers/v1/auth.js`, refactor the refactor the `createInstitution` function:

```js
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(200).json({ msg: "User already exists" });
    }

    const salt = await bcryptjs.genSalt();

    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

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

```

### controllers/v1/institutions.js

In the `controllers/v1/institutions.js`, refactor the refactor the `createInstitution` function:

```js
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;

    const { id } = req.user;

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    /**
     * If the authenticated user is not an admin, they can
     * not create a new record
     */
    if (user.role !== "ADMIN_USER") {
      return res.status(403).json({
        msg: "Not authorized to access this route",
      });
    }

    await prisma.institution.create({
      data: { name, region, country, userId: id },
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

---

## Postman

Test your changes in **Postman** before you move on to the **Formative Assessment** section.

The screenshot below is an example of registering an basic user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-1.jpeg)

The screenshot below is an example of registering an admin user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-2.jpeg)

The screenshot below is an example of logging in as a basic user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-3.jpeg)

The screenshot below is an example of logging in as an admin user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-4.jpeg)

The screenshot below is an example of setting the **Authorization** headers for a basic and an admin user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-5.jpeg)

The screenshot below is an example of disabling the **Authorization** headers for an admin user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-6.jpeg)

The screenshot below is an example of a **POST** request to a protected route using a basic user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-7.jpeg)

The screenshot below is an example of disabling the **Authorization** headers for an basic user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-8.jpeg)

The screenshot below is an example of a **POST** request to a protected route using an admin user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-9.jpeg)

## Formative Assessment
