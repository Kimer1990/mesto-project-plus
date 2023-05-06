import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import * as process from "process";
import { UnauthorizedError } from "../errors";

interface ISessionRequest extends Request {
  user?: string | JwtPayload;
}

const { JWT_SECRET = "none" } = process.env;
const extractBearerToken = (token: string) => token.replace("Bearer ", "");

// eslint-disable-next-line consistent-return
export default (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Необходима авторизация"));
  } else {
    const token = extractBearerToken(authorization);
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET as string);
    } catch (err) {
      return next(new UnauthorizedError("Необходима авторизация"));
    }

    req.user = payload;

    next();
  }
};
