import { NextFunction, Request, Response } from "express";
import User from "../models/users";
import { BadRequestError, NotFoundError } from "../errors";
import { ICustomRequest } from "../types";

export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      throw err;
    })
    .catch(next);
};

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { name, about, avatar } = req.body;
  return User.create({
    name,
    about,
    avatar,
  })
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        throw new BadRequestError("Были предоставлены неверные данные");
      }
      throw err;
    })
    .catch(next);
};

export const updateProfile = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { name, about } = req.body;
  const id = req.user!._id;
  return User.findByIdAndUpdate(
    id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((updateUser) => res.status(200).send(updateUser))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        throw new BadRequestError("Были предоставлены неверные данные");
      }
      if (err instanceof Error && err.name === "CastError") {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      throw err;
    })
    .catch(next);
};

export const updateProfileAvatar = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { avatar } = req.body;
  const id = req.user!._id;
  return User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((updateUser) => res.status(200).send(updateUser))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        throw new BadRequestError("Были предоставлены неверные данные");
      }
      if (err instanceof Error && err.name === "CastError") {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      throw err;
    })
    .catch(next);
};
