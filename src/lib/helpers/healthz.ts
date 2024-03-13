import { Elysia } from "elysia";
import prisma from "../client/prisma";

export const healthz = new Elysia().get("/healthz", async () => {
  await prisma.$queryRaw`SELECT 1`;
  return "OK";
});
