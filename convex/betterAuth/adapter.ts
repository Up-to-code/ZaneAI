import { createApi } from "@convex-dev/better-auth";

import { createAuthOptions } from "../auth/createAuthOptions";
import schema from "./schema";

const adapterApi: any = createApi(schema, createAuthOptions);

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} = adapterApi;
