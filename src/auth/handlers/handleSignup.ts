import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import bcrypt from "bcrypt";
import { ENV } from "../../lib/config/env";
import prisma from "../../lib/client/prisma";

export const signupDto = t.Object({
  username: t.String(),
  password: t.String(),
  passwordRepeat: t.String(),
});

export const handleSignup = new Elysia()
  .use(jwt({ secret: ENV.JWT_SECRET, exp: "30d" }))
  .post(
    "/signup",
    async ({ jwt, body, cookie: { auth } }) => {
      if (body.password !== body.passwordRepeat) {
        throw new Error("Passwords do not match");
      }

      const saltRounds = 10;
      const hash = bcrypt.hashSync(body.password, saltRounds);

      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: hash,
        },
      });

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
      body: signupDto,
    }
  );
