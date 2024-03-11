# 03: Authorisation/Access Control

If you get stuck, a completed version of this project is available in the **exemplar** directory.

## Authorisation/Access Control

Authorisation/access control is a process of determining if a user has the right to access a resource. For example, if a user is logged in, they should be able to access their user data. If a user is not logged in, they should not be able to access their user data.

### schema.prisma

In the `schema.prisma` file, add a new enum called `Role` with the values `ADMIN_USER` and `BASIC_USER`. Update the `User` to include a `role` field with the default value of `BASIC_USER`. Make sure you create a new migration.

### controllers/v1/auth.js

In the `controllers/v1/auth.js`, refactor the `register` function:

```js
const register = async (req, res) => {
  try {
    const contentType = req.headers["content-type"];
    if (!contentType || contentType !== "application/json") {
      return res.status(400).json({
        msg: "Invalid Content-Type. Expected application/json",
      });
    }

    // Get the role from the Request's body property
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

### controllers/v1/institution.js

In the `controllers/v1/institution.js`, refactor the `createInstitution` function:

```js
const createInstitution = async (req, res) => {
  try {
    const { name, region, country } = req.body;

    const { id } = req.user;

    const user = await prisma.user.findUnique({ where: { id: id } });

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

## Postman

Test the changes in **Postman** before you move on to the **Formative Assessment** section.

The screenshot below is an example of registering a basic user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-1.PNG)

The screenshot below is an example of registering an admin user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-2.PNG)

The screenshot below is an example of logging in as a basic user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-3.PNG)

The screenshot below is an example of logging in as an admin user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-4.PNG)

The screenshot below is an example of setting the **Authorization** headers for a basic and an admin user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-5.PNG)

The screenshot below is an example of disabling the **Authorization** headers for an admin user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-6.PNG)

The screenshot below is an example of a **POST** request to a protected route using a basic user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-7.PNG)

The screenshot below is an example of disabling the **Authorization** headers for a basic user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-8.PNG)

The screenshot below is an example of a **POST** request to a protected route using an admin user.

![](../../resources/img/03-authorisation-access-control/03-authorisation-access-control-9.PNG)

# Formative Assessment

Before you start, create a new branch called **03-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

## Task Rua

In the `schema.prisma` file, add a new value called `SUPER_ADMIN_USER` to the `Role` enum. Make sure you create a new migration using the commands `npx prisma migrate reset && npx prisma migrate dev` before you move on to **Task Toru**.

## Task Toru

In the `controllers/v1/institution.js` and `controllers/v1/department.js` files, refactor the `create` \& `update` functions so that the `ADMIN_USER` and `SUPER_ADMIN_USER` are the only users authorised to create and update a resource, i.e., institution or department. Test the changes in **Postman** before you move on to **Task Whā**.

## Task Whā

In the `controllers/v1/institution.js` and `controllers/v1/department.js` files, refactor the `delete` function so that the `SUPER_ADMIN_USER` is the only user authorised to delete a resource, i.e., institution or department. Test the changes in **Postman** before you move on to the **Formative Assessment Submission**.

# Formative Assessment Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.
