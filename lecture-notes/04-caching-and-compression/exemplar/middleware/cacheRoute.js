import NodeCache from "node-cache";

// Create a new cache instance with a 5-minute Time to Live (stdTTL) and a 310-second check period
const cache = new NodeCache({ stdTTL: 300, checkperiod: 310 });

// Define a middleware function for caching responses
const cacheRoute = (req, res, next) => {
  // Generate a unique cache key based on the request's URL and authorization header
  const key = req.originalUrl + req.headers.authorization;

  const cachedRes = cache.get(key);

  // Check if it is not a GET request and there's a cached response for the key
  if (req.method !== "GET" && cachedRes) {
    // Log a message indicating that the cached entry is deleted from the cache
    console.log(`${key} deleted from the cache`);

    // Delete the cached response to maintain consistency
    cache.del(key);

    // Proceed to the next middleware in the stack
    return next();
  }
  // If there is a cached response, and it is a GET request, return it
  else if (cachedRes) {
    // Log a message indicating a cache hit
    console.log("Cache hit");

    // Send the cached response back to the client
    return res.json(cachedRes);
  }
  // If there's no cached response, it is a cache miss
  else {
    // Log a message indicating a cache miss
    console.log("Cache miss");

    // Create a custom `res.json()` method that wraps the original method
    res.originalSend = res.json;
    res.json = (body) => {
      // Call the original `res.json()` method to send the response to the client
      res.originalSend(body);

      // Cache the response with the generated key
      cache.set(key, body);
    };

    // Proceed to the next middleware in the stack
    return next();
  }
};

export default cacheRoute;
