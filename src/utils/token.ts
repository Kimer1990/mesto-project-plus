import jwt from "jsonwebtoken";
import * as process from "process";

const { JWT_SECRET = "none" } = process.env;
export const generateToken = (payload: Record<string, string>) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });

export default {};
