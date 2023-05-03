import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateProfileAvatar,
} from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:userId", getUserById);
usersRouter.post("/", createUser);
usersRouter.patch("/me", updateProfile);
usersRouter.patch("/me/avatar", updateProfileAvatar);

export default usersRouter;
