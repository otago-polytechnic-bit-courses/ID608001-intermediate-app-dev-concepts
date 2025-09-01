import { buildSchema } from "graphql";

import typeDefs from "./typeDefs.js";

const schema = buildSchema(typeDefs);

export default schema;
