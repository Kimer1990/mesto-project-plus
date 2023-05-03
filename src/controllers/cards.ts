import { ObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import Card from "../models/cards";
import { BadRequestError, NotFoundError } from "../errors";
import { ICustomRequest } from "../types";

export const getCards = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(next);

export const createCard = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const id = req.user!._id;
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: id,
  })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err instanceof Error && err.name === "ValidationError") {
        throw new BadRequestError("Были предоставлены неверные данные");
      }
      throw err;
    })
    .catch(next);
};

export const deleteCardById = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then(() => res.status(200).send({
      message: "Карточка удалена",
    }))
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        throw new NotFoundError("Нет карточки с таким id");
      }
      throw err;
    })
    .catch(next);
};

export const likeCard = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const id = req.user!._id;
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        throw new NotFoundError("Нет карточки с таким id");
      }
      throw err;
    })
    .catch(next);
};

export const dislikeCard = (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const id = req.user!._id as ObjectId;
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof Error && err.name === "CastError") {
        throw new NotFoundError("Нет карточки с таким id");
      }
      throw err;
    })
    .catch(next);
};
