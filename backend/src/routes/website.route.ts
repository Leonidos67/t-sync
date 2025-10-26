import { Router } from "express";
import { 
  getWebsiteByUsernameController, 
  createWebsiteController, 
  updateWebsiteController, 
  deleteWebsiteController 
} from "../controllers/website.controller";
import jwtAuth from "../middlewares/jwtAuth.middleware";

const websiteRoutes = Router();

// Публичный маршрут для получения данных сайта
websiteRoutes.get("/:username", getWebsiteByUsernameController);

// Защищенные маршруты для управления сайтом
websiteRoutes.post("/create", jwtAuth, createWebsiteController);
websiteRoutes.put("/update", jwtAuth, updateWebsiteController);
websiteRoutes.delete("/delete", jwtAuth, deleteWebsiteController);

export default websiteRoutes;
