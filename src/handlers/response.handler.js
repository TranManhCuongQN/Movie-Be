const responseWithData = (res, statusCode, data) =>
  res.status(statusCode).json(data);

const error = (res) =>
  responseWithData(res, 500, {
    status: 500,
    message: "Oops! Something went wrong. Please try again later.",
  });

const badRequest = (res, message) =>
  responseWithData(res, 400, {
    status: 400,
    message: message,
  });

const OK = (res, data) => responseWithData(res, 200, data);

const created = (res, data) => responseWithData(res, 201, data);

const unauthorized = (res, message) =>
  responseWithData(res, 401, {
    status: 401,
    message: "Unauthorized",
  });

const notFound = (res, message) =>
  responseWithData(res, 404, {
    status: 404,
    message: "Not Found",
  });

export default {
  error,
  badRequest,
  OK,
  created,
  unauthorized,
  notFound,
};
