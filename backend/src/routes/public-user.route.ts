import { Router } from "express";
import { getPublicUserController, getPublicFeedController, getAllPublicUsersController, getAllPublicClubsController } from "../controllers/user.controller";

const publicUserRoutes = Router();

publicUserRoutes.get("/feed", getPublicFeedController);
publicUserRoutes.get("/all", getAllPublicUsersController);
publicUserRoutes.get("/clubs", getAllPublicClubsController);
publicUserRoutes.get("/:username", getPublicUserController);

export default publicUserRoutes; 