import { Context, Elysia, NotFoundError, ValidationError } from "elysia";

export class UnauthorizedError extends Error {
  status = 401;

  constructor(public message: string) {
    super(message);
  }
}

export class InvalidSignatureError extends Error {
  status = 400;

  constructor(public message: string) {
    super(message);
  }
}

type CustomError =
  | NotFoundError
  | UnauthorizedError
  | InvalidSignatureError
  | ValidationError;

export const handleError = new Elysia().onError(({ code, error }) => {
  if (code === "VALIDATION") {
    return {
      code: error.status,
      data: error.validator.Errors(error.value).First().message,
      status: false,
      message: "ERROR",
    };
  }

  return {
    code: (error as CustomError).status ?? 500,
    data: error.message,
    status: false,
    message: "ERROR",
  };
});
