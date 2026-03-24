import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const before = Date.now();
        const result = await query(args);
        const after = Date.now();

        // console.log(`Query ${model}.${operation} took ${after - before}ms`);

        return result;
      },
    },
  },
});

export default prisma;
