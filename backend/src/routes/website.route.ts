import { Router } from "express";
import { 
  getWebsiteByUsernameController, 
  createWebsiteController, 
  updateWebsiteController, 
  deleteWebsiteController 
} from "../controllers/website.controller";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";

const websiteRoutes = Router();

// Публичный маршрут для получения данных сайта
websiteRoutes.get("/:username", getWebsiteByUsernameController);

// Защищенные маршруты для управления сайтом
websiteRoutes.post("/create", isAuthenticated, createWebsiteController);
websiteRoutes.put("/update", isAuthenticated, updateWebsiteController);
websiteRoutes.delete("/delete", isAuthenticated, deleteWebsiteController);

export default websiteRoutes;
