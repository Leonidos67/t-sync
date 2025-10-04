import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import AuthRoute from "./auth.route";
import {
  authenticationRoutePaths,
  baseRoutePaths,
  protectedRoutePaths,
} from "./common/routes";
import AppLayout from "@/layout/app.layout";
import BaseLayout from "@/layout/base.layout";
import NotFound from "@/page/errors/NotFound";
import Creatium from "@/page/creatium/Creatium";
import CreatiumCreate from "@/page/creatium/CreatiumCreate";
import { AuthProvider } from "@/context/auth-provider";
import { PinnedWorkspacesProvider } from "@/context/pinned-workspaces-provider";
import AuthGuard from "@/components/auth-guard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PinnedWorkspacesProvider>
          <Routes>
          {/* Standalone service route without platform layouts */}
          <Route path="/creatium" element={<AuthGuard><Creatium /></AuthGuard>} />
          <Route path="/creatium/create" element={<AuthGuard><CreatiumCreate /></AuthGuard>} />
          <Route element={<BaseLayout />}>
            {baseRoutePaths.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

          <Route path="/" element={<AuthRoute />}>
            <Route element={<BaseLayout />}>
              {authenticationRoutePaths.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Route>

          {/* Protected Route */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {protectedRoutePaths.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Route>
          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PinnedWorkspacesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
