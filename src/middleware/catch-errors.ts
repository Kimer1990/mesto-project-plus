import { ErrorRequestHandler } from "express";

// eslint-disable-next-line no-unused-vars
const catchErrors: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
};

export default catchErrors;
