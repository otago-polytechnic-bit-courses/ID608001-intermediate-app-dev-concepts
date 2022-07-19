# 06: Optimisation

## Preparation

Use the repository from the previous **Formative Assessment**. Create a new branch called `06-playground`. Checkout to the `06-playground` branch and open the repository in **Visual Studio Code**.

**Note:** Carefully read the comments in the code examples below.

---

## Overview

---

## Compression

To get started, run the following command:

```bash
npm install compression
```

Check the `package.json` file to ensure you have installed `compression`.

In the `app.js` file, import `compression`. For example:

```js
import compression from "compression";
```

For testing purposes, add the following `GET` route
```js
app.get(`/${BASE_URL}/${CURRENT_VERSION}/optimisation`, (req, res) => {
  const text = "See you later, alligator. Bye bye bye, butterfly"
  res.json({ msg: text.repeat(1000) })
});
```

In a browser, navigate to <http://localhost:3000/api/v1/optimisation>. Open the **development tools** and keep your eye on the amount of kilobytes transferred over the network. 

The screenshot below is an example of before compression.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/06-optimisation/06-optimisation-1.PNG)

As you can see, there is 51.1 kilobytes transferred over the network.

Add the following **middleware**:

```js
app.use(compression());
```

In the browser, refresh the page.

The screenshot below is an example of after compression.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/06-optimisation/06-optimisation-2.PNG)

As you can see, there is 3.4 kilobytes transferred over the network which is significantly lower than the previous benchmark.

---

## Caching

To get started, run the following command:

```bash
npm install node-cache
```

Check the `package.json` file to ensure you have installed `node-cache`.

In the `middleware` directory, create a new file called `cacheRoute.js`. In the `cacheRoute.js` file, add the following code:

```js
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 310 });

const cacheRoute = (req, res, next) => {
  const key = req.url;
  const cachedRes = cache.get(key);

  if (req.method !== "GET" && cachedRes) {
    console.log(`${key} deleted from the cache`);
    cache.del(key);
    return next();
  } else if (cachedRes) {
    console.log("Cache hit");
    return res.json(cachedRes);
  } else {
    console.log("Cache miss");
    res.originalSend = res.json;
    res.json = (body) => {
      res.originalSend(body);
      cache.set(key, body);
    };
    return next();
  }
};

export default cacheRoute;
```

---

## app.js

In the `app.js` file, add the following import:

```js
import cacheRoute from "./middleware/cacheRoute.js";
```

Then add the following **middleware**:

```js
app.use(cacheRoute);
```

## Postman

Test your changes in **Postman** before you move on to the **Formative Assessment** section.

The screenshot below is an example of a cache miss.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/06-optimisation/06-optimisation-1.PNG)

The screenshot below is an example of deleting a key from the cache.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/06-optimisation/06-optimisation-2.PNG)

The screenshot below is an example of a cache hit.

![](https://github.com/otago-polytechnic-bit-courses/ID608001-intermediate-app-dev-concepts/blob/master/resources/img/06-optimisation/06-optimisation-3.PNG)

## Formative Assessment
