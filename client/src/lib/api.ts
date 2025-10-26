import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AnalyticsResponseType,
  WeeklyAnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  EditTaskPayloadType,
  CreateWorkspaceResponseType,
  EditProjectPayloadType,
  ProjectByIdPayloadType,
  ProjectResponseType,
  CreateWebsiteType,
  CreateWebsiteResponseType,
  GetWebsiteByUsernameResponseType,
  CreateWorkspaceType,
} from "../types/api.type";
import {
  AllWorkspaceResponseType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  WorkspaceByIdResponseType,
  EditWorkspaceType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const autoLoginMutationFn = async (
  email: string,
  targetService: string = 'volt'
): Promise<LoginResponseType & { targetService?: string }> => {
  const response = await API.post("/auth/auto-login", { email, targetService });
  return response.data;
};

export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const updateUserRoleMutationFn = async (userRole: "coach" | "athlete") => {
  const response = await API.put("/auth/role", { userRole });
  return response.data;
};

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    console.log('🔍 getCurrentUserQueryFn - Starting request to /user/current');
    try {
      const response = await API.get(`/user/current`);
      console.log('🔍 getCurrentUserQueryFn - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔍 getCurrentUserQueryFn - Error:', error);
      throw error;
    }
  };

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const getWorkspaceWeeklyAnalyticsQueryFn = async (
  workspaceId: string,
  weekOffset: number = 0
): Promise<WeeklyAnalyticsResponseType> => {
  const response = await API.get(`/workspace/weekly-analytics/${workspaceId}?weekOffset=${weekOffset}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  iniviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/member/workspace/${iniviteCode}/join`);
  return response.data;
};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};


export const editTaskMutationFn = async ({
  taskId,
  projectId,
  workspaceId,
  data,
}: EditTaskPayloadType): Promise<{message: string;}> => {
  const response = await API.put(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  includeHidden,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (includeHidden !== undefined) queryParams.append("includeHidden", includeHidden.toString());
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

export const hideTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.patch(
    `task/${taskId}/workspace/${workspaceId}/hide`
  );
  return response.data;
};

export const unhideTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.patch(
    `task/${taskId}/workspace/${workspaceId}/unhide`
  );
  return response.data;
};

export const onboardingMutationFn = async (data: { answer: string }) => {
  const response = await API.patch("/user/onboarding", data);
  return response.data;
};

export const updateProfilePictureMutationFn = async (profilePicture: string) => {
  const response = await API.patch("/user/profile-picture", { profilePicture });
  return response.data;
};

export const setUsernameMutationFn = async (username: string) => {
  const response = await API.patch("/user/set-username", { username });
  return response.data;
};

export const updatePersonalDataMutationFn = async (data: {
  phoneNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDate?: string;
  city?: string;
}) => {
  const response = await API.patch("/user/personal-data", data);
  return response.data;
};

export const updateNotificationSettingsMutationFn = async (data: {
  email?: boolean;
  push?: boolean;
  tasks?: boolean;
  newTasks?: boolean;
  taskUpdates?: boolean;
  projectUpdates?: boolean;
}) => {
  const response = await API.patch("/user/notification-settings", data);
  return response.data;
};

export const changePasswordMutationFn = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await API.patch("/user/change-password", data);
  return response.data as { message: string };
};

export const getFollowersQueryFn = async (username: string) => {
  const response = await API.get(`/user/${username}/followers`);
  return response.data;
};

export const getFollowingQueryFn = async (username: string) => {
  const response = await API.get(`/user/${username}/following`);
  return response.data;
};

export const followUserMutationFn = async (username: string) => {
  const response = await API.post(`/user/${username}/follow`);
  return response.data;
};

export const unfollowUserMutationFn = async (username: string) => {
  const response = await API.post(`/user/${username}/unfollow`);
  return response.data;
};

export const getUserPostsQueryFn = async (username: string) => {
  const response = await API.get(`/user/${username}/posts`);
  return response.data;
};

export const createUserPostMutationFn = async (username: string, data: { text: string; image?: string | null }) => {
  const response = await API.post(`/user/${username}/posts`, data);
  return response.data;
};

export const deleteUserPostMutationFn = async (postId: string) => {
  const response = await API.delete(`/user/posts/${postId}`);
  return response.data;
};

export const likeUserPostMutationFn = async (postId: string) => {
  const response = await API.post(`/user/posts/${postId}/like`);
  return response.data;
};

export const fireUserPostMutationFn = async (postId: string) => {
  const response = await API.post(`/user/posts/${postId}/fire`);
  return response.data as { fired: boolean; firesCount: number };
};

export const wowUserPostMutationFn = async (postId: string) => {
  const response = await API.post(`/user/posts/${postId}/wow`);
  return response.data as { wowed: boolean; wowsCount: number };
};

export const getFeedQueryFn = async () => {
  const response = await API.get(`/user/feed`);
  return response.data;
};

export const getPublicFeedQueryFn = async () => {
  // Use fetch without credentials to avoid CORS/cookie preflights and axios timeouts for public feed
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(`/api/user/public/feed`, {
      method: 'GET',
      credentials: 'omit',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error(`Public feed error: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
};

export const getAllPublicUsersQueryFn = async () => {
  const response = await API.get(`/user/public/all`);
  return response.data;
};

export const getAllPublicClubsQueryFn = async () => {
  const response = await API.get(`/user/public/clubs`);
  return response.data;
};

export const searchUsersQueryFn = async (query: string) => {
  const response = await API.get(`/user/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const searchClubsQueryFn = async (query: string) => {
  const response = await API.get(`/user/clubs/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

// WEBSITE API
export const createWebsiteMutationFn = async (data: CreateWebsiteType): Promise<CreateWebsiteResponseType> => {
  const response = await API.post("/website/create", data);
  return response.data;
};

export const getWebsiteByUsernameQueryFn = async (username: string): Promise<GetWebsiteByUsernameResponseType> => {
  const response = await API.get(`/website/${username}`);
  return response.data;
};

export const updateWebsiteMutationFn = async (data: CreateWebsiteType): Promise<CreateWebsiteResponseType> => {
  const response = await API.put("/website/update", data);
  return response.data;
};

export const deleteWebsiteMutationFn = async (): Promise<{ message: string }> => {
  const response = await API.delete("/website/delete");
  return response.data;
};

// CLUB API
export const createClubMutationFn = async (data: { name: string; username: string; description?: string }) => {
  const response = await API.post("/user/clubs", data);
  return response.data;
};

export const getAllClubsQueryFn = async () => {
  const response = await API.get("/user/clubs");
  return response.data;
};

export const getClubByUsernameQueryFn = async (username: string) => {
  const response = await API.get(`/user/clubs/${username}`);
  return response.data;
};

export const getUserCreatedClubsQueryFn = async () => {
  const response = await API.get("/user/clubs/my");
  return response.data;
};

export const joinClubMutationFn = async (clubId: string) => {
  const response = await API.post(`/user/clubs/${clubId}/join`);
  return response.data;
};

export const leaveClubMutationFn = async (clubId: string) => {
  const response = await API.post(`/user/clubs/${clubId}/leave`);
  return response.data;
};

export const deleteClubMutationFn = async (clubId: string) => {
  const response = await API.delete(`/user/clubs/${clubId}`);
  return response.data;
};

export const updateClubActionButtonMutationFn = async (data: {
  clubId: string;
  showActionButton: boolean;
  actionType: string;
  actionValue: string;
  buttonText: string;
}) => {
  const response = await API.patch(`/user/clubs/${data.clubId}/action-button`, {
    showActionButton: data.showActionButton,
    actionType: data.actionType,
    actionValue: data.actionValue,
    buttonText: data.buttonText
  });
  return response.data;
};

export const updateClubAppearanceMutationFn = async (data: {
  clubId: string;
  showCreator: boolean;
}) => {
  const response = await API.patch(`/user/clubs/${data.clubId}/appearance`, {
    showCreator: data.showCreator
  });
  return response.data;
};

export const uploadClubAvatarMutationFn = async (data: {
  clubId: string;
  avatar: File;
}) => {
  const formData = new FormData();
  formData.append('avatar', data.avatar);
  
  const response = await API.post(`/user/clubs/${data.clubId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const removeClubAvatarMutationFn = async (data: {
  clubId: string;
}) => {
  const response = await API.delete(`/user/clubs/${data.clubId}/avatar`);
  return response.data;
};

// CLUB POSTS API
export const getClubPostsQueryFn = async (username: string) => {
  const response = await API.get(`/user/clubs/${username}/posts`);
  return response.data;
};

export const createClubPostMutationFn = async (username: string, data: { 
  text: string; 
  image?: string | null; 
  location?: string; 
  isPublic?: boolean 
}) => {
  const response = await API.post(`/user/clubs/${username}/posts`, data);
  return response.data;
};