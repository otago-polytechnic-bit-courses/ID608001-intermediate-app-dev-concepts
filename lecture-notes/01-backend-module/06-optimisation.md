# 06: Optimisation

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

Then add the following **middleware**:

```js
app.use(compression());
```

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

## Helmet

## Formative Assessment
