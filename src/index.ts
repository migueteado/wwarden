import jwt from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Context, Elysia } from "elysia";
import { ENV } from "./lib/config/env";
import { handleError } from "./lib/helpers/handleError";
import { handleResponse } from "./lib/helpers/handleResponse";
import { robots } from "./lib/helpers/robots";
import { healthz } from "./lib/helpers/healthz";
import cors from "@elysiajs/cors";
import { handleSignup } from "./auth/handlers/handleSignup";
import { handleSignin } from "./auth/handlers/handleSignIn";
import { handleGetCategories } from "./categories/handlers/handleGetCategories";

const app = new Elysia()
  .use(swagger())
  .use(cors())
  .use(handleError)
  .use(handleResponse)
  .use(robots)
  .use(healthz)
  .use(jwt({ secret: ENV.JWT_SECRET, exp: "30d" }))
  .get("/", () => "WWarden API")
  .get("/profile", async ({ jwt, set, cookie: { auth } }) => {
    const profile = await jwt.verify(auth.value);

    if (!profile) {
      set.status = 401;
      return "Unauthorized";
    }

    return `Hello ${profile.username}`;
  })
  .group("/auth", (app) => {
    return app.use(handleSignup).use(handleSignin);
  })
  .group("/categories", (app) => {
    return app.use(handleGetCategories);
  })
  .listen(3000);

console.log(
  `🚀 WWarden is running at ${app.server?.hostname}:${app.server?.port}`
);
