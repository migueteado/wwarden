import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import bcrypt from "bcrypt";
import { ENV } from "../../lib/config/env";
import prisma from "../../lib/client/prisma";

export const signinDto = t.Object({
  username: t.String(),
  password: t.String(),
});

export const handleSignin = new Elysia()
  .use(jwt({ secret: ENV.JWT_SECRET, exp: "30d" }))
  .post(
    "/signin",
    async ({ jwt, body, cookie: { auth } }) => {
      const user = await prisma.user.findUnique({
        where: { username: body.username },
      });
      if (!user) {
        throw new Error("Invalid username or password");
      }

      const match = bcrypt.compareSync(body.password, user.password);

      if (!match) {
        throw new Error("Invalid username or password");
      }

      auth.set({
        value: await jwt.sign({
          id: user.id,
          username: user.username,
        }),
        httpOnly: true,
        maxAge: 30 * 86400,
      });

      return `Signed in as ${user.username}`;
    },
    {
      body: signinDto,
    }
  );
