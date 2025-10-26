import { Router } from "express";
import { getCurrentUserController, onboardingUserController, updateProfilePictureController, setUsernameController, checkUsernameController, getPublicUserController, getFollowersController, getFollowingController, followUserController, unfollowUserController, getAllUsersController, getUserPostsController, createPostController, deletePostController, likePostController, getFeedController, searchUsersController, searchClubsController, updatePersonalDataController, updateNotificationSettingsController, changePasswordController, firePostController, wowPostController, createClubController, getAllClubsController, getClubByUsernameController, getUserCreatedClubsController, joinClubController, leaveClubController, deleteClubController, updateClubActionButtonController, updateClubAppearanceController, uploadClubAvatarController, removeClubAvatarController, getClubPostsController, createClubPostController } from "../controllers/user.controller";
import jwtAuth from "../middlewares/jwtAuth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";

const userRoutes = Router();

userRoutes.get("/current", jwtAuth, getCurrentUserController);
userRoutes.patch("/onboarding", jwtAuth, onboardingUserController);
userRoutes.post("/profile-picture", jwtAuth, updateProfilePictureController);
userRoutes.patch("/set-username", jwtAuth, setUsernameController);
userRoutes.get("/check-username", checkUsernameController);
userRoutes.patch("/personal-data", jwtAuth, updatePersonalDataController);
userRoutes.patch("/notification-settings", jwtAuth, updateNotificationSettingsController);
userRoutes.patch("/change-password", jwtAuth, changePasswordController);
userRoutes.get("/all", getAllUsersController);
userRoutes.get("/search", searchUsersController);
userRoutes.get("/clubs/search", searchClubsController);
userRoutes.get("/feed", getFeedController);
userRoutes.get("/:username/followers", getFollowersController);
userRoutes.get("/:username/following", getFollowingController);
userRoutes.post("/:username/follow", jwtAuth, followUserController);
userRoutes.post("/:username/unfollow", jwtAuth, unfollowUserController);
userRoutes.get("/:username/posts", getUserPostsController);
userRoutes.post("/:username/posts", jwtAuth, createPostController);
userRoutes.delete("/posts/:postId", jwtAuth, deletePostController);
userRoutes.post("/posts/:postId/like", jwtAuth, likePostController);
userRoutes.post("/posts/:postId/fire", jwtAuth, firePostController);
userRoutes.post("/posts/:postId/wow", jwtAuth, wowPostController);

// Club routes
userRoutes.post("/clubs", jwtAuth, createClubController);
userRoutes.get("/clubs", getAllClubsController);
userRoutes.get("/clubs/my", jwtAuth, getUserCreatedClubsController);
userRoutes.get("/clubs/:username", getClubByUsernameController);
userRoutes.post("/clubs/:clubId/join", jwtAuth, joinClubController);
userRoutes.post("/clubs/:clubId/leave", jwtAuth, leaveClubController);
userRoutes.delete("/clubs/:clubId", jwtAuth, deleteClubController);
userRoutes.patch("/clubs/:clubId/action-button", jwtAuth, updateClubActionButtonController);
userRoutes.patch("/clubs/:clubId/appearance", jwtAuth, updateClubAppearanceController);
userRoutes.post("/clubs/:clubId/avatar", jwtAuth, uploadSingle, uploadClubAvatarController);
userRoutes.delete("/clubs/:clubId/avatar", jwtAuth, removeClubAvatarController);

// Club posts routes
userRoutes.get("/clubs/:username/posts", getClubPostsController);
userRoutes.post("/clubs/:username/posts", jwtAuth, createClubPostController);

export default userRoutes;
