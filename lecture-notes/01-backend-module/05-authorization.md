# 05: Authorization

## OAuth

**Open Authorization (OAuth)** is an open standard for authorization. It uses **access tokens** instead of **user credentials**, i.e., username and password to authorize applications. Also, it is known as **secure delegated access**.

**Resource:** <https://oauth.net>

---

## Basic Implementation

### Schema

In the `schema.prisma` file, add a new field called `isAdmin` of type `Boolean` with a default value of `false` to the `User` model. Make sure you create a new migration.

### controller/v1/institutions.js

In the `controller/v1/institutions.js`, refactor the refactor the `createInstitution` function:

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
    if (!user.isAdmin) {
      return res.status(403).json({
        msg: "Not authorized to access this route",
      });
    }

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

---

## Formative Assessment
