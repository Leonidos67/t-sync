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
import Pragma from "@/page/pragma/pragma";
import PragmaCreate from "@/page/pragma/pragmaCreate";
import { AuthProvider } from "@/context/auth-provider";
import { PinnedWorkspacesProvider } from "@/context/pinned-workspaces-provider";
import AuthGuard from "@/components/auth-guard";
import ScrollToTop from "@/components/ScrollToTop";

function AppRoutes() {
  console.log('🚀 AppRoutes - Rendering routes');
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <PinnedWorkspacesProvider>
          <Routes>
          <Route path="/pragma" element={<AuthGuard><Pragma /></AuthGuard>} />
          <Route path="/pragma/create" element={<AuthGuard><PragmaCreate /></AuthGuard>} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {protectedRoutePaths.map((route) => {
                console.log('🛡️ ProtectedRoute - Mapping route:', route.path);
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                );
              })}
            </Route>
          </Route>

          <Route element={<BaseLayout />}>
            {baseRoutePaths.map((route) => {
              console.log('📍 BaseRoute - Mapping route:', route.path);
              return (
                <Route key={route.path} path={route.path} element={route.element} />
              );
            })}
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
          {/* Catch-all for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PinnedWorkspacesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;

