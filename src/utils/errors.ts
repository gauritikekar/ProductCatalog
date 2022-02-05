import {
  badImplementation,
  badRequest,
  boomify,
  forbidden,
  isBoom,
  notFound,
  unauthorized,
} from "@hapi/boom";
import { StatusCodes } from "http-status-codes";

const toHttpStatus = (error: unknown): number =>
  (isBoom(error) && error.output.statusCode) ||
  StatusCodes.INTERNAL_SERVER_ERROR;

const createHttpError = (error: Error, statusCode: number) =>
  boomify(error, { statusCode });

const errors = {
  createHttpError,
  notFound,
  badRequest,
  badImplementation,
  forbidden,
  unauthorized,
};

export { errors, toHttpStatus };
