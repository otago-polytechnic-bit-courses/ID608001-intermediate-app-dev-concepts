# 07: Testing

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `07-playground`. Checkout to the `07-playground` branch and open the repository in **Visual Studio Code**.

---

## Mocha

**Mocha** is a **JavaScript** testing framework for **Node.js** applications. 

**Note:** Most programming languages, i.e., **C#**, **Java**, **PHP**, etc., each have several testing frameworks.

To get started with **Mocha**, run the following command:


```bash
npm install mocha --save-dev
```

**Resource:** <https://mochajs.org>

---

## Chai

**Chai** is a **JavaScript** assertion library for **Node.js** applications. 

To get started with **Chai**, run the following command:


```bash
npm install chai chai-http --save-dev
```

**Resource:** <https://www.chaijs.com>

---

## Unit Testing

**Unit testing** is a **software testing** technique by which units of code, i.e., **functions** or **methods** are tested **individually** to determine whether they are fit for use.

In the root directory, create a new directory called `test`. In the `test` directory, create a new file called `00-unit-test.test.js`. In the `00-unit-test.test.js` file, add the following code:

```js
import chai from "chai";
import { describe, it } from "mocha";

/**
 * @param {Number} a 
 * @param {Number} b 
 * @returns the sum of a and b
 */
const addTwoNums = (a, b) => a + b;

describe("unit test example", () => {
  it("should return the correct result for addTwoNums", (done) => {
    chai.expect(addTwoNums(1, 2)).to.equal(3);
    done();
  });

  it("should return the incorrect result for addTwoNums", (done) => {
    chai.expect(addTwoNums(1, 2)).to.not.equal(4);
    done();
  });
});
```

---

## Seeding

In the `test` directory, create a new file called `01-setup.test.js`. In the `01-setup.test.js` file, add the following code:

```js
import { before, after } from "mocha";
import { seedInstitutions } from "../controllers/v1/institutions.js";
import { seedDepartments } from "../controllers/v1/departments.js";

const seed = () => {
  seedInstitutions();
  seedDepartments();
};

// Before each test, seed the Institution and Department tables with data fetched from a GitHub Gist
before((done) => {
  seed();
  done();
});

// After each test, do something
after((done) => {
  // You may want to delete all the data from the Institution and Department tables
  done();
});
```

---

## Integration Testing

**Integration testing** is a **software testing** technique by which units of code, i.e., **functions** or **methods** are tested as a **group** to determine whether they are fit for use.

In the `test` directory, create a new file called `02-integration.test.js`. In the `02-integration.test.js` file, add the following code:

```js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

const BASE_URL = "https://gist.githubusercontent.com/Grayson-Orr/c17079a40517ec29679dc9585ba7af76/raw";

chai.use(chaiHttp); // Provides an interface for integration testing

describe("integration - GitHub Gist", () => {
  it("should get institutions", (done) => {
    chai
      .request(BASE_URL)
      .get("/institutions.json")
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(200);
        done();
      });
  });
});
```

---

## API Testing

In the `test` directory, create a new file called `03-auth.test.js`. In the `03-auth.test.js` file, add the following code:

```js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

chai.use(chaiHttp);

const BASE_URL = "/api/v1/auth";

const adminUser = {
  name: "John Doe",
  email: "john.doe@op.ac.nz",
  password: "Pazzw0rd123",
  role: "ADMIN_USER",
};

describe("auth", () => {
  it("should register admin user with valid input", (done) => {
    chai
      .request(app)
      .post(`${BASE_URL}/register`)
      .send(adminUser)
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(201);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.msg).to.be.equal("User successfully registered");
        done();
      });
  });

  it("should login admin user with valid input", (done) => {
    const { email, password } = adminUser;
    chai
      .request(app)
      .post(`${BASE_URL}/login`)
      .send({
        email,
        password,
      })
      .end((_, res) => {
        chai.expect(res.status).to.be.equal(200);
        chai.expect(res.body).to.be.a("object");
        chai.expect(res.body.msg).to.be.equal("User successfully logged in");
        done();
      });
  });
});

export default adminUser;
```

In the `test` directory, create a new file called `04-institutions.test.js`. In the `04-institutions.test.js` file, add the following code:

```js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

import adminUser from "./03-auth.test.js";

chai.use(chaiHttp);

const BASE_URL = "/api/v1";

const institution = {
  id: 3,
  name: "Southern Institute of Technology",
  region: "Southland",
  country: "New Zealand",
};

describe("institutions", () => {
  it("should create institution", (done) => {
    const { email, password } = adminUser;
    chai
      .request(app)
      .post(`${BASE_URL}/auth/login`)
      .send({
        email,
        password,
      })
      .end((_, loginRes) => {
        chai
          .request(app)
          .post(`${BASE_URL}/institutions`)
          .auth(loginRes.body.token, { type: "bearer" })
          .send(institution)
          .end((__, institutionRes) => {
            chai.expect(institutionRes.status).to.be.equal(201);
            chai.expect(institutionRes.body).to.be.a("object");
            chai
              .expect(institutionRes.body.msg)
              .to.be.equal("Institution successfully created");
            done();
          });
      });
  });
});
```

In the `package.json` file, add the following script:

```bash
"test": "npx mocha --timeout 10000 --exit"
```

---

## Formative Assessment

### Task Tahi

If you have not already, implement the code examples above before you move on to **Task Rua**.

### Task Rua

Create four additional **API tests** for getting one institution, getting all institutions, updating an institution and deleting an institution. Test your **API tests** before you move on to the **Code Review**.

---

## Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.
