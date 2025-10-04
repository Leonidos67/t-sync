import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Asidebar from "@/components/asidebar/asidebar";
import CreateWorkspaceDialog from "@/components/workspace/create-workspace-dialog";
import CreateProjectDialog from "@/components/workspace/project/create-project-dialog";
import Header from "@/components/header";
import AiFab from "@/components/ai/ai-fab";
import SelectionAsk from "@/components/ai/selection-ask";

const AppLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const isWelcomePage = segments[0] === "workspace" && segments.length === 2;

  return (
    <SidebarProvider>
      <div className="flex h-screen min-h-screen w-full bg-background main-content">
        {!isWelcomePage && <Asidebar />}
        <SidebarInset className="overflow-x-hidden flex-1 bg-background relative main-content">
          <div className="w-full h-full bg-background relative z-10 pointer-events-auto main-content">
            {!isWelcomePage && <Header />}
            <div className={isWelcomePage ? "px-0 lg:px-0 py-0 bg-transparent relative z-10 pointer-events-auto min-h-0 main-content" : "px-3 lg:px-20 py-0 bg-background relative z-10 pointer-events-auto min-h-0 main-content"}>
              <Outlet />
            </div>
            <CreateWorkspaceDialog />
            <CreateProjectDialog />
            {!isWelcomePage && <AiFab />}
            {!isWelcomePage && <SelectionAsk />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
