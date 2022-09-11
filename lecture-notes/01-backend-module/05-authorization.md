# 05: Authorization

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `05-playground`. Checkout to the `05-playground` branch and open the repository in **Visual Studio Code**.

---

## OAuth

**Open Authorization (OAuth)** is an open standard for authorization. It uses **access tokens** instead of **user credentials**, i.e., username and password to authorize applications. Also, it is known as **secure delegated access**.

**Note:** You will not be implementing **OAuth** in this course but important to know about.

**Resource:** <https://oauth.net>

---

## Basic Implementation

### Schema

In the `schema.prisma` file, add a new enum called `Role` with the values `ADMIN_USER` and `BASIC_USER`. Update the `User` to include a `role` field with the default value of `BASIC_USER`. Make sure you create a new migration using the commands `npx prisma migrate reset && npx prisma migrate dev`.

### controllers/v1/auth.js

In the `controllers/v1/auth.js`, refactor the `register` function:

```js
const register = async (req, res) => {
  try {
    /**
     * Get the role from the Request's body property
     */ 
    const { name, email, password, username, role } = req.body;

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return res.status(200).json({ msg: "User already exists" });
    }

    const salt = await bcryptjs.genSalt();

    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await prisma.user.create({
      data: { name, email, password: hashedPassword, username, role },
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

In the `controllers/v1/institutions.js`, refactor the `createInstitution` function:

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

Test the changes in **Postman** before you move on to the **Formative Assessment** section.

The screenshot below is an example of registering a basic user.

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

The screenshot below is an example of disabling the **Authorization** headers for a basic user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-8.jpeg)

The screenshot below is an example of a **POST** request to a protected route using an admin user.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/05-authorization/05-authorization-9.jpeg)

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**. 

### Task Rua

In the `schema.prisma` file, add a new value called `SUPER_ADMIN_USER` to the `Role` enum. Make sure you create a new migration using the commands `npx prisma migrate reset && npx prisma migrate dev` before you move on to **Task Toru**.

### Task Toru

In the `controllers/v1/institutions.js` and `controllers/v1/departments.js` files, refactor the `create` \& `update` functions so that the `ADMIN_USER` and `SUPER_ADMIN_USER` are the only users authorised to create and update a resource, i.e., institution or department. Test the changes in **Postman** before you move on to **Task Whā**.

### Task Whā

In the `controllers/v1/institutions.js` and `controllers/v1/departments.js` files, refactor the `delete` function so that the `SUPER_ADMIN_USER` is the only user authorised to delete a resource, i.e., institution or department. Test the changes in **Postman** before you move on to the **Code Review**.

---

## Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
