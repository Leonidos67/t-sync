import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignIn from "@/page/auth/Sign-in";
import SignUp from "@/page/auth/Sign-up";
import VoltLogin from "@/page/volt-login";
import VoltSignUp from "@/page/volt-signup";
import WorkspaceDashboard from "@/page/workspace/Dashboard";
import WorkspaceWelcome from "@/page/workspace/Welcome";
import React from "react";
import Members from "@/page/workspace/Members";
import ProjectDetails from "@/page/workspace/ProjectDetails";
import Settings from "@/page/workspace/Settings";
import GeneralSettings from "@/page/workspace/GeneralSettings";
import Notifications from "@/page/workspace/Notifications";
import UserGuide from "@/page/workspace/UserGuide";
import Tasks from "@/page/workspace/Tasks";
import Profile from "@/page/workspace/Profile";
import Usage from "@/page/workspace/Usage";
import CompletedTasks from "@/page/workspace/CompletedTasks";
import CreateWebsite from "@/page/website/CreateWebsite";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import InviteUser from "@/page/invite/InviteUser";
import UsersListPage from "@/page/users/UsersList";
import UserProfile from "@/page/users/Profile";
import SocialMainPage from "@/page/users/index";
import ClubsPage from "@/page/users/ClubsPage";
import BoardPage from "@/page/users/BoardPage";
import ClubDetail from "@/page/users/ClubDetail";
import ClubCreatePage from "@/page/users/ClubCreatePage";
import ClubSettings from "@/page/users/ClubSettings";
import BoardCreatePage from "@/page/users/BoardCreatePage";
import PublicWebsitePage from "@/page/website/PublicWebsite";
import LandingProxy from "@/page/landing/LandingProxy";
import AiAssistant from "@/page/ai/Assistant";
import AuthGuard from "@/components/auth-guard";
import VoltAuthGuard from "@/components/volt-auth-guard";
import IdPage from "@/page/id";
import RoadmapPage from "@/page/landing/Roadmap";
import PricingPage from "@/page/landing/Pricing";
import AIPage from "@/page/landing/AI";
import AboutPage from "@/page/landing/About";
import HelpPage from "@/page/landing/Help";
import ContactPage from "@/page/landing/Contact";
import ServicesPage from "@/page/landing/Services";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths = [
  { path: "/workspace/welcome", element: <WorkspaceWelcome /> },
  { path: "/workspace/:workspaceId", element: <WorkspaceWelcome /> },
  { path: "/workspace/:workspaceId/id", element: <IdPage /> },
  { path: "/workspace/:workspaceId/id/", element: <IdPage /> },
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.GENERAL_SETTINGS, element: <GeneralSettings /> },
  { path: PROTECTED_ROUTES.NOTIFICATIONS, element: <Notifications /> },
  { path: PROTECTED_ROUTES.USER_GUIDE, element: <UserGuide /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },
  { path: PROTECTED_ROUTES.PROFILE, element: <Profile /> },
  { path: PROTECTED_ROUTES.REQUISITES, element: <Profile /> },
  { path: PROTECTED_ROUTES.USAGE, element: <Usage /> },
  { path: PROTECTED_ROUTES.COMPLETED, element: <CompletedTasks /> },
  { path: PROTECTED_ROUTES.CREATE_WEBSITE, element: <CreateWebsite /> },
  { path: PROTECTED_ROUTES.AI, element: <AiAssistant /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
  { path: "/volt-login", element: <VoltLogin /> },
  { path: "/volt-signup", element: <VoltSignUp /> },
  { path: "/id", element: <AuthGuard><IdPage /></AuthGuard> },
  { path: "/id/", element: <AuthGuard><IdPage /></AuthGuard> },
  { path: "/u/", element: <VoltAuthGuard><SocialMainPage /></VoltAuthGuard> },
  { path: "/u/users", element: <VoltAuthGuard><UsersListPage /></VoltAuthGuard> },
  { path: "/u/users/:username", element: <VoltAuthGuard><UserProfile /></VoltAuthGuard> },
  { path: "/u/clubs", element: <VoltAuthGuard><ClubsPage /></VoltAuthGuard> },
  { path: "/u/board", element: <VoltAuthGuard><BoardPage /></VoltAuthGuard> },
  { path: "/u/board/", element: <VoltAuthGuard><BoardPage /></VoltAuthGuard> },
  { path: "/u/board/create", element: <AuthGuard><BoardCreatePage /></AuthGuard> },
  { path: "/u/club-create", element: <AuthGuard><ClubCreatePage /></AuthGuard> },
  { path: "/u/clubs/:username", element: <VoltAuthGuard><ClubDetail /></VoltAuthGuard> },
  { path: "/u/clubs/:username/settings", element: <AuthGuard><ClubSettings /></AuthGuard> },
  { path: "/web/:username", element: <PublicWebsitePage /> },
  { path: "/", element: <LandingProxy /> },
  { path: "/roadmap", element: <RoadmapPage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/ai", element: <AIPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/help", element: <HelpPage /> },
  { path: "/contact", element: <ContactPage /> },
  { path: "/services", element: <ServicesPage /> },
];

function WorkspaceHomeRedirect() {
  const { workspaceId } = useParams();
  return <Navigate to={`/workspace/${workspaceId}/home`} replace />;
}



