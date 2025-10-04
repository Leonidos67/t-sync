import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import UserModel from "../models/user.model";

// Получить данные сайта пользователя по username
export const getWebsiteByUsernameController = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }

    const user = await UserModel.findOne({ username: username.toLowerCase().trim() });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Возвращаем данные сайта пользователя
    const websiteData = user.websiteData || {
      title: `${user.name} - Профиль`,
      description: `Профиль пользователя ${user.name}`,
      about: `Привет! Меня зовут ${user.name}. Добро пожаловать на мой профиль!`,
      gallery: [],
      isPublished: true
    };

    return res.status(200).json({
      website: {
        username: user.username,
        name: user.name,
        profileImage: user.profilePicture,
        title: websiteData.title,
        description: websiteData.description,
        about: websiteData.about,
        gallery: websiteData.gallery,
        isPublished: websiteData.isPublished,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt || user.createdAt
      }
    });
  }
);

// Создать сайт пользователя
export const createWebsiteController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { title, description, about, gallery, isPublished } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Обновляем данные пользователя с информацией о сайте
    user.websiteData = {
      title: title || `${user.name} - Профиль`,
      description: description || `Профиль пользователя ${user.name}`,
      about: about || `Привет! Меня зовут ${user.name}. Добро пожаловать на мой профиль!`,
      gallery: gallery || [],
      isPublished: isPublished || false
    };

    await user.save();

    return res.status(201).json({
      message: "Website created successfully",
      website: user.websiteData
    });
  }
);

// Обновить сайт пользователя
export const updateWebsiteController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { title, description, about, gallery, isPublished } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Обновляем данные сайта
    if (!user.websiteData) {
      user.websiteData = {
        title: `${user.name} - Профиль`,
        description: `Профиль пользователя ${user.name}`,
        about: `Привет! Меня зовут ${user.name}. Добро пожаловать на мой профиль!`,
        gallery: [],
        isPublished: false
      };
    }
    
    if (title) user.websiteData.title = title;
    if (description) user.websiteData.description = description;
    if (about) user.websiteData.about = about;
    if (gallery) user.websiteData.gallery = gallery;
    if (isPublished !== undefined) user.websiteData.isPublished = isPublished;

    await user.save();

    return res.status(200).json({
      message: "Website updated successfully",
      website: user.websiteData
    });
  }
);

// Удалить сайт пользователя
export const deleteWebsiteController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Удаляем данные сайта
    user.websiteData = undefined;
    await user.save();

    return res.status(200).json({
      message: "Website deleted successfully"
    });
  }
);
