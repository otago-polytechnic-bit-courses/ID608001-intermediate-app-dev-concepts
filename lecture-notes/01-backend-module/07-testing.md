## 07: Testing

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `07-playground`. Checkout to the `07-playground` branch and open the repository in **Visual Studio Code**.

**Note:** Carefully read the comments in the code examples below.

---

## Overview

---

## Mocha

```bash
npm install mocha --save-dev
```

---

## Chai

```bash
npm install chai chai-http --save-dev
```

---

## Seeding

```js
import { before, after } from "mocha";
import { seedInstitutions } from "../controllers/v1/institutions.js";
import { seedDepartments } from "../controllers/v1/departments.js";

const seed = () => {
  seedInstitutions();
  seedDepartments();
};

before((done) => {
  seed();
  done();
});

after((done) => {
  seed();
  done();
});

```

---

## Integration Testing

```js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

const BASE_URL = "https://gist.githubusercontent.com/Grayson-Orr/c17079a40517ec29679dc9585ba7af76/raw";

chai.use(chaiHttp);

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

```js
import chai from "chai";
import chaiHttp from "chai-http";
import { describe, it } from "mocha";

import app from "../app.js";

import adminUser from "./02-auth.test.js";

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

```bash
"test": "npx mocha --timeout 10000 --exit"
```

---

## Formative Assessment

### Code Review

Once you have completed all tasks, open a pull request and assign **grayson-orr** as a reviewer. Please do not merge the pull request.