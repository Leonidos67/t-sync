import { Router } from "express";
import { getCurrentUserController, onboardingUserController, updateProfilePictureController, setUsernameController, checkUsernameController, getPublicUserController, getFollowersController, getFollowingController, followUserController, unfollowUserController, getAllUsersController, getUserPostsController, createPostController, deletePostController, likePostController, getFeedController, searchUsersController, searchClubsController, updatePersonalDataController, updateNotificationSettingsController, changePasswordController, firePostController, wowPostController, createClubController, getAllClubsController, getClubByUsernameController, getUserCreatedClubsController, joinClubController, leaveClubController, deleteClubController, updateClubActionButtonController, updateClubAppearanceController, uploadClubAvatarController, removeClubAvatarController, getClubPostsController, createClubPostController } from "../controllers/user.controller";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);
userRoutes.patch("/onboarding", onboardingUserController);
userRoutes.post("/profile-picture", updateProfilePictureController);
userRoutes.patch("/set-username", setUsernameController);
userRoutes.get("/check-username", checkUsernameController);
userRoutes.patch("/personal-data", isAuthenticated, updatePersonalDataController);
userRoutes.patch("/notification-settings", isAuthenticated, updateNotificationSettingsController);
userRoutes.patch("/change-password", isAuthenticated, changePasswordController);
userRoutes.get("/all", getAllUsersController);
userRoutes.get("/search", searchUsersController);
userRoutes.get("/clubs/search", searchClubsController);
userRoutes.get("/feed", getFeedController);
userRoutes.get("/:username/followers", getFollowersController);
userRoutes.get("/:username/following", getFollowingController);
userRoutes.post("/:username/follow", isAuthenticated, followUserController);
userRoutes.post("/:username/unfollow", isAuthenticated, unfollowUserController);
userRoutes.get("/:username/posts", getUserPostsController);
userRoutes.post("/:username/posts", isAuthenticated, createPostController);
userRoutes.delete("/posts/:postId", isAuthenticated, deletePostController);
userRoutes.post("/posts/:postId/like", isAuthenticated, likePostController);
userRoutes.post("/posts/:postId/fire", isAuthenticated, firePostController);
userRoutes.post("/posts/:postId/wow", isAuthenticated, wowPostController);

// Club routes
userRoutes.post("/clubs", isAuthenticated, createClubController);
userRoutes.get("/clubs", getAllClubsController);
userRoutes.get("/clubs/my", isAuthenticated, getUserCreatedClubsController);
userRoutes.get("/clubs/:username", getClubByUsernameController);
userRoutes.post("/clubs/:clubId/join", isAuthenticated, joinClubController);
userRoutes.post("/clubs/:clubId/leave", isAuthenticated, leaveClubController);
userRoutes.delete("/clubs/:clubId", isAuthenticated, deleteClubController);
userRoutes.patch("/clubs/:clubId/action-button", isAuthenticated, updateClubActionButtonController);
userRoutes.patch("/clubs/:clubId/appearance", isAuthenticated, updateClubAppearanceController);
userRoutes.post("/clubs/:clubId/avatar", isAuthenticated, uploadSingle, uploadClubAvatarController);
userRoutes.delete("/clubs/:clubId/avatar", isAuthenticated, removeClubAvatarController);

// Club posts routes
userRoutes.get("/clubs/:username/posts", getClubPostsController);
userRoutes.post("/clubs/:username/posts", isAuthenticated, createClubPostController);

export default userRoutes;
