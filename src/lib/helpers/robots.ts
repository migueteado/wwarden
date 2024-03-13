import { Elysia, t } from "elysia";

export const robots = new Elysia().get(
  "/robots.txt",
  () => "User-agent: *\nDisallow: /",
  {
    response: t.String(),
  }
);
