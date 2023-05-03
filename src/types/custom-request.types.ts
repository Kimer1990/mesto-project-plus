import { Request } from "express";
import { ObjectId } from "mongoose";

export interface ICustomRequest extends Request {
  user?: {
    _id: string | ObjectId;
  };
}
