import { Elysia } from "elysia";

const textResponses = ["/", "/healthz", "/version", "/robots.txt"];

export const handleResponse = new Elysia().onAfterHandle((ctx) => {
  const response = ctx.response;
  if (textResponses.includes(ctx.path)) {
    return response;
  }

  return {
    code: ctx.set.status ?? 200,
    data: response,
    status: true,
    message: "OK",
  };
});
