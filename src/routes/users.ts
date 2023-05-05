import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUser,
  updateProfile,
  updateProfileAvatar,
} from "../controllers";
import {
  getUserByIdValidation,
  updateProfileValidation,
  updateProfileAvatarValidation,
} from "../validation";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/me", getUser);
usersRouter.get("/:userId", getUserByIdValidation, getUserById);
usersRouter.patch("/me", updateProfileValidation, updateProfile);
usersRouter.patch(
  "/me/avatar",
  updateProfileAvatarValidation,
  updateProfileAvatar,
);

export default usersRouter;
