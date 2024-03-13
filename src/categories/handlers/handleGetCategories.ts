import { Elysia, t } from "elysia";
import prisma from "../../lib/client/prisma";

export const handleGetCategories = new Elysia().get("/", async () => {
  const categories = await prisma.categories.findMany({
    include: {
      subcategories: true,
    },
  });

  return categories;
});
