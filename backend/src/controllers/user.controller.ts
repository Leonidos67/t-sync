import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";
import UserModel, { FollowerModel, PostModel, ClubModel } from "../models/user.model";
import { compareValue } from "../utils/bcrypt";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);

export const onboardingUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ message: "Answer is required" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isNewUser = false;
    user.onboardingAnswer = answer;
    await user.save();
    return res.status(200).json({ message: "Onboarding complete" });
  }
);

export const updateProfilePictureController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { profilePicture } = req.body;
    if (!profilePicture) {
      return res.status(400).json({ message: "profilePicture is required" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = profilePicture;
    await user.save();
    return res.status(200).json({ message: "Profile picture updated", profilePicture });
  }
);

export const setUsernameController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    // Проверка на уникальность
    const existing = await UserModel.findOne({ username: username.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "Username уже занят" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username.toLowerCase().trim();
    await user.save();
    return res.status(200).json({ message: "Username установлен", username: user.username });
  }
);

export const checkUsernameController = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.query;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ message: "username is required" });
    }
    
    // Проверка на уникальность
    const existing = await UserModel.findOne({ username: username.toLowerCase().trim() });
    
    return res.status(200).json({ 
      available: !existing,
      username: username.toLowerCase().trim()
    });
  }
);

export const getPublicUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    const user = await UserModel.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      userRole: user.userRole, // Добавляем информацию о роли
      // email: user.email, // если нужно показывать email
    });
  }
);

// Получить подписчиков пользователя
export const getFollowersController = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username: username.toLowerCase().trim() });
  if (!user) return res.status(404).json({ message: "User not found" });
  const followers = await FollowerModel.find({ following: user._id }).populate({ path: "follower", select: "username name profilePicture userRole" });
  return res.status(200).json({ followers: followers.map((f: any) => f.follower) });
});

// Получить на кого подписан пользователь
export const getFollowingController = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username: username.toLowerCase().trim() });
  if (!user) return res.status(404).json({ message: "User not found" });
  const following = await FollowerModel.find({ follower: user._id }).populate({ path: "following", select: "username name profilePicture userRole" });
  return res.status(200).json({ following: following.map((f: any) => f.following) });
});

// Подписаться на пользователя
export const followUserController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { username } = req.params;
  const userToFollow = await UserModel.findOne({ username: username.toLowerCase().trim() });
  if (!userToFollow) return res.status(404).json({ message: "User not found" });
  if ((userToFollow._id as any).equals(userId)) return res.status(400).json({ message: "Нельзя подписаться на себя" });
  const exists = await FollowerModel.findOne({ follower: userId, following: userToFollow._id });
  if (exists) return res.status(409).json({ message: "Вы уже подписаны" });
  await FollowerModel.create({ follower: userId, following: userToFollow._id });
  return res.status(200).json({ message: "Вы подписались" });
});

// Отписаться от пользователя
export const unfollowUserController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { username } = req.params;
  const userToUnfollow = await UserModel.findOne({ username: username.toLowerCase().trim() });
  if (!userToUnfollow) return res.status(404).json({ message: "User not found" });
  await FollowerModel.deleteOne({ follower: userId, following: userToUnfollow._id });
  return res.status(200).json({ message: "Вы отписались" });
});

export const updatePersonalDataController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { phoneNumber, email, firstName, lastName, gender, birthDate, city } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Обновляем поля
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (email !== undefined) user.email = email;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (gender !== undefined) user.gender = gender;
    if (birthDate !== undefined) user.birthDate = birthDate;
    if (city !== undefined) user.city = city;

    // Обновляем полное имя
    if (firstName !== undefined || lastName !== undefined) {
      const fullName = `${firstName || user.firstName || ''} ${lastName || user.lastName || ''}`.trim();
      user.name = fullName;
    }

    await user.save();

    return res.status(200).json({
      message: "Личные данные успешно обновлены",
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        birthDate: user.birthDate,
        city: user.city
      }
    });
  }
);

export const updateNotificationSettingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { email, push, tasks, newTasks, taskUpdates, projectUpdates } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Инициализируем настройки уведомлений если их нет
    if (!user.notificationSettings) {
      user.notificationSettings = {
        email: true,
        push: true,
        tasks: true,
        newTasks: true,
        taskUpdates: true,
        projectUpdates: true
      };
    }

    // Обновляем настройки уведомлений
    if (email !== undefined) user.notificationSettings.email = email;
    if (push !== undefined) user.notificationSettings.push = push;
    if (tasks !== undefined) user.notificationSettings.tasks = tasks;
    if (newTasks !== undefined) user.notificationSettings.newTasks = newTasks;
    if (taskUpdates !== undefined) user.notificationSettings.taskUpdates = taskUpdates;
    if (projectUpdates !== undefined) user.notificationSettings.projectUpdates = projectUpdates;

    await user.save();

    return res.status(200).json({
      message: "Настройки уведомлений успешно обновлены",
      notificationSettings: user.notificationSettings
    });
  }
);

export const changePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Текущий и новый пароли обязательны" });
    }

    const user = await UserModel.findById(userId).select("+password");
    if (!user || !user.password) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isMatch = await compareValue(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный текущий пароль" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Пароль успешно изменён" });
  }
);

export const getAllUsersController = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserModel.find({}, "name username profilePicture");
  return res.status(200).json({ users });
});

// Поиск пользователей по имени
export const searchUsersController = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(200).json({ users: [] });
  }

  const users = await UserModel.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } }
    ]
  }, "name username profilePicture userRole").limit(10);

  return res.status(200).json({ users });
});

// Поиск клубов
export const searchClubsController = asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(200).json({ clubs: [] });
  }

  const clubs = await ClubModel.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } }
    ]
  })
    .populate("creator", "username name profilePicture userRole")
    .populate("members", "username name profilePicture")
    .limit(10);

  return res.status(200).json({ clubs });
});

// Получить посты пользователя
export const getUserPostsController = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username: username.toLowerCase().trim() });
  if (!user) return res.status(404).json({ message: "User not found" });
  const posts = await PostModel.find({ author: user._id, authorType: 'User' }).sort({ createdAt: -1 });
  return res.status(200).json({ posts });
});

// Создать пост
export const createPostController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { text, image, location, isPublic } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Текст обязателен" });
  }
  const post = await PostModel.create({ 
    author: userId, 
    authorType: 'User',
    text, 
    image, 
    location: location || null,
    isPublic: isPublic !== undefined ? isPublic : true
  });
  return res.status(201).json({ post });
});

// Удалить пост
export const deletePostController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { postId } = req.params;
  const post = await PostModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Пост не найден" });
  if (!post.author.equals(userId)) return res.status(403).json({ message: "Нет прав на удаление" });
  await post.deleteOne();
  return res.status(200).json({ message: "Пост удалён" });
});

// Лайк/дизлайк поста
export const likePostController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { postId } = req.params;
  const post = await PostModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Пост не найден" });
  
  // Инициализируем authorType для старых постов
  if (!post.authorType) {
    post.authorType = 'User';
    await post.save();
  }
  
  const liked = post.likes.some((id: any) => id.equals(userId));
  if (liked) {
    post.likes = post.likes.filter((id: any) => !id.equals(userId));
  } else {
    post.likes.push(userId);
  }
  await post.save();
  return res.status(200).json({ liked: !liked, likesCount: post.likes.length });
});

// Реакция огонь/снять огонь
export const firePostController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { postId } = req.params;
  const post = await PostModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Пост не найден" });
  
  // Инициализируем authorType для старых постов
  if (!post.authorType) {
    post.authorType = 'User';
    await post.save();
  }
  
  // Инициализируем массив fires если его нет (на старых данных)
  if (!Array.isArray(post.fires)) {
    post.fires = [];
  }
  
  const hasFire = post.fires.some((id: any) => id.equals(userId));
  if (hasFire) {
    post.fires = post.fires.filter((id: any) => !id.equals(userId));
  } else {
    post.fires.push(userId);
  }
  
  await post.save();
  return res.status(200).json({ fired: !hasFire, firesCount: post.fires.length });
});

// Реакция WOW/снять WOW
export const wowPostController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { postId } = req.params;
  const post = await PostModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Пост не найден" });
  
  // Инициализируем authorType для старых постов
  if (!post.authorType) {
    post.authorType = 'User';
    await post.save();
  }
  
  // Инициализируем массив wows если его нет
  if (!Array.isArray(post.wows)) {
    post.wows = [];
  }
  
  const hasWow = post.wows.some((id: any) => id.equals(userId));
  if (hasWow) {
    post.wows = post.wows.filter((id: any) => !id.equals(userId));
  } else {
    post.wows.push(userId);
  }
  
  await post.save();
  return res.status(200).json({ wowed: !hasWow, wowsCount: post.wows.length });
});

// Лента новостей (все посты)
export const getFeedController = asyncHandler(async (req: Request, res: Response) => {
  const posts = await PostModel.find({})
    .sort({ createdAt: -1 })
    .populate("author", "username name profilePicture userRole");
  return res.status(200).json({ posts });
});

// Публичная лента новостей (все посты) - без аутентификации
export const getPublicFeedController = asyncHandler(async (req: Request, res: Response) => {
  const posts = await PostModel.find({})
    .sort({ createdAt: -1 })
    .populate("author", "username name profilePicture userRole");
  return res.status(200).json({ posts });
});

// Публичный список всех пользователей - без аутентификации
export const getAllPublicUsersController = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserModel.find({}, "name username profilePicture userRole");
  return res.status(200).json({ users });
});

// Публичный список всех клубов - без аутентификации
export const getAllPublicClubsController = asyncHandler(async (req: Request, res: Response) => {
  const clubs = await ClubModel.find({})
    .sort({ createdAt: -1 })
    .populate("creator", "username name profilePicture userRole")
    .populate("members", "username name profilePicture");
  return res.status(200).json({ clubs });
});

// Создать клуб
export const createClubController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { name, username, description } = req.body;
  
  if (!name || !username) {
    return res.status(400).json({ message: "Название и username обязательны" });
  }

  // Проверка на уникальность username клуба
  const existingClub = await ClubModel.findOne({ username: username.toLowerCase().trim() });
  if (existingClub) {
    return res.status(409).json({ message: "Username клуба уже занят" });
  }

  const club = await ClubModel.create({
    name,
    username: username.toLowerCase().trim(),
    description: description || "",
    creator: userId,
    members: [userId] // Создатель автоматически становится участником
  });

  await club.populate("creator", "username name profilePicture");
  
  return res.status(201).json({ club });
});

// Получить все клубы
export const getAllClubsController = asyncHandler(async (req: Request, res: Response) => {
  const clubs = await ClubModel.find({})
    .sort({ createdAt: -1 })
    .populate("creator", "username name profilePicture userRole")
    .populate("members", "username name profilePicture");
  return res.status(200).json({ clubs });
});

// Получить клуб по username
export const getClubByUsernameController = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const club = await ClubModel.findOne({ username: username.toLowerCase().trim() })
    .populate("creator", "username name profilePicture userRole")
    .populate("members", "username name profilePicture");
  
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }
  
  return res.status(200).json({ club });
});

// Присоединиться к клубу
export const joinClubController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { clubId } = req.params;
  
  if (!clubId) {
    return res.status(400).json({ message: "ID клуба обязателен" });
  }

  const club = await ClubModel.findById(clubId);
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверяем, не является ли пользователь уже участником
  if (club.members.includes(userId)) {
    return res.status(409).json({ message: "Вы уже являетесь участником этого клуба" });
  }

  // Проверяем, не является ли пользователь создателем клуба
  if (club.creator.toString() === userId) {
    return res.status(409).json({ message: "Вы являетесь создателем этого клуба" });
  }

  // Добавляем пользователя к участникам клуба
  club.members.push(userId);
  await club.save();

  return res.status(200).json({ message: "Вы успешно присоединились к клубу" });
});

// Покинуть клуб
export const leaveClubController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { clubId } = req.params;
  
  if (!clubId) {
    return res.status(400).json({ message: "ID клуба обязателен" });
  }

  const club = await ClubModel.findById(clubId);
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверяем, является ли пользователь создателем клуба
  if (club.creator.toString() === userId) {
    return res.status(409).json({ message: "Создатель клуба не может покинуть клуб" });
  }

  // Удаляем пользователя из участников клуба
  club.members = club.members.filter(memberId => memberId.toString() !== userId);
  await club.save();

  return res.status(200).json({ message: "Вы покинули клуб" });
});

// Получить клубы созданные пользователем
export const getUserCreatedClubsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const clubs = await ClubModel.find({ creator: userId })
    .sort({ createdAt: -1 })
    .populate("creator", "username name profilePicture userRole")
    .populate("members", "username name profilePicture");
  return res.status(200).json({ clubs });
});

// Удалить клуб
export const deleteClubController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { clubId } = req.params;
  
  if (!clubId) {
    return res.status(400).json({ message: "ID клуба обязателен" });
  }

  const club = await ClubModel.findById(clubId);
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверяем, что пользователь является создателем клуба
  if (club.creator.toString() !== userId) {
    return res.status(403).json({ message: "Только создатель клуба может его удалить" });
  }

  await ClubModel.findByIdAndDelete(clubId);
  return res.status(200).json({ message: "Клуб успешно удален" });
});

// Обновить настройки кнопки действия клуба
export const updateClubActionButtonController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { clubId } = req.params;
  const { showActionButton, actionType, actionValue, buttonText } = req.body;
  
  if (!clubId) {
    return res.status(400).json({ message: "ID клуба обязателен" });
  }

  const club = await ClubModel.findById(clubId);
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверяем, что пользователь является создателем клуба
  if (club.creator.toString() !== userId) {
    return res.status(403).json({ message: "Только создатель клуба может изменять настройки" });
  }

  // Обновляем настройки кнопки действия
  club.actionButton = {
    show: showActionButton,
    type: actionType as 'website' | 'phone' | 'email',
    value: actionValue,
    text: buttonText
  };

  await club.save();
  return res.status(200).json({ message: "Настройки кнопки действия обновлены" });
});

// Обновить настройки внешнего вида клуба
export const updateClubAppearanceController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { clubId } = req.params;
  const { showCreator } = req.body;
  
  if (!clubId) {
    return res.status(400).json({ message: "ID клуба обязателен" });
  }

  const club = await ClubModel.findById(clubId);
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверяем, что пользователь является создателем клуба
  if (club.creator.toString() !== userId) {
    return res.status(403).json({ message: "Только создатель клуба может изменять настройки" });
  }

  // Обновляем настройки внешнего вида
  club.showCreator = showCreator;

  await club.save();
  return res.status(200).json({ message: "Настройки внешнего вида обновлены" });
});

// Загрузить аватарку клуба
export const uploadClubAvatarController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { clubId } = req.params;
  
  if (!clubId) {
    return res.status(400).json({ message: "ID клуба обязателен" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Файл не загружен" });
  }

  const club = await ClubModel.findById(clubId);
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверяем, что пользователь является создателем клуба
  if (club.creator.toString() !== userId) {
    return res.status(403).json({ message: "Только создатель клуба может изменять аватарку" });
  }

  // Обновляем аватарку клуба
  club.avatar = req.file.path;
  await club.save();

  return res.status(200).json({ 
    message: "Аватарка клуба обновлена",
    avatar: club.avatar
  });
});

// Удалить аватарку клуба
export const removeClubAvatarController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { clubId } = req.params;
  
  if (!clubId) {
    return res.status(400).json({ message: "ID клуба обязателен" });
  }

  const club = await ClubModel.findById(clubId);
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверяем, что пользователь является создателем клуба
  if (club.creator.toString() !== userId) {
    return res.status(403).json({ message: "Только создатель клуба может изменять аватарку" });
  }

  // Удаляем аватарку клуба (устанавливаем в null)
  club.avatar = null;
  await club.save();

  return res.status(200).json({ 
    message: "Аватарка клуба удалена"
  });
});

// Получить посты клуба
export const getClubPostsController = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const club = await ClubModel.findOne({ username: username.toLowerCase() });
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }
  
  // Получаем посты, где author равен ID клуба и authorType = 'Club'
  const posts = await PostModel.find({ author: club._id, authorType: 'Club' })
    .populate("author", "username name profilePicture")
    .sort({ createdAt: -1 });
  
  return res.status(200).json({ posts });
});

// Создать пост от имени клуба
export const createClubPostController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { username } = req.params;
  const { text, image, location, isPublic } = req.body;
  
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Текст обязателен" });
  }

  // Найти клуб
  const club = await ClubModel.findOne({ username: username.toLowerCase() });
  if (!club) {
    return res.status(404).json({ message: "Клуб не найден" });
  }

  // Проверить, является ли пользователь участником клуба
  if (!club.members.includes(userId)) {
    return res.status(403).json({ message: "Только участники клуба могут создавать посты" });
  }

  const post = await PostModel.create({ 
    author: club._id, // Используем ID клуба как автора
    authorType: 'Club',
    text, 
    image, 
    location: location || null,
    isPublic: isPublic !== undefined ? isPublic : true
  });

  await post.populate("author", "username name profilePicture");
  
  return res.status(201).json({ post });
});