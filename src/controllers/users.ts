import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { BadRequestError, NotFoundError } from "../errors";
import { ICustomRequest } from "../types";
import { generateToken } from "../utils/token";

export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(next);

export const getUser = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const id = req.user!._id as string;

  return User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else {
        next(err);
      }
    });
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else {
        next(err);
      }
    });
};

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hashPassword) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    }).then((newUser) => res.status(201).send(newUser)))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        next(new BadRequestError("Были предоставлены неверные данные"));
      } else if (err.code === 11000) {
        next(new BadRequestError("Пользователь с таким email уже существует"));
      } else {
        next(err);
      }
    });
};

export const updateProfile = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
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
    },
  )
    .then((updateUser) => res.status(200).send(updateUser))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        next(new BadRequestError("Были предоставлены неверные данные"));
      } else if (err instanceof Error && err.name === "CastError") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else {
        next(err);
      }
    });
};

export const updateProfileAvatar = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { avatar } = req.body;
  const id = req.user!._id;

  return User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateUser) => res.status(200).send(updateUser))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        next(new BadRequestError("Были предоставлены неверные данные"));
      } else if (err instanceof Error && err.name === "CastError") {
        next(new NotFoundError("Нет пользователя с таким id"));
      } else {
        next(err);
      }
    });
};

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken({
        _id: user.id as string,
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        next(new BadRequestError("Были предоставлены неверные данные"));
      } else {
        next(err);
      }
    });
};
