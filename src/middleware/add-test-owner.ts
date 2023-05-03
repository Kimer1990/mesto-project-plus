import { NextFunction, Response } from "express";
import { ICustomRequest } from "../types";

const addTestOwner = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  req.user = {
    _id: "6451cf94e1c9939eb7b34925",
  };
  next();
};

export default addTestOwner;
