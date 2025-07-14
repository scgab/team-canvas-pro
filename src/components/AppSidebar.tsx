import { useState } from "react";
import { 
  LayoutDashboard, 
  Kanban, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  FolderOpen
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Board", url: "/board", icon: Kanban },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Team", url: "/team", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-foreground font-medium border-r-2 border-primary" 
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground";

  return (
    <Sidebar
      className={`${!open ? "w-16" : "w-64"} bg-gradient-sidebar border-r border-sidebar-border transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="px-3 py-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Kanban className="w-5 h-5 text-white" />
          </div>
          {open && (
            <span className="text-xl font-bold text-sidebar-foreground">
              ProManage
            </span>
          )}
        </div>

        {/* Quick Actions */}
        {open && (
          <div className="mb-6">
            <Button size="sm" className="w-full bg-gradient-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wide">
            {open ? "Main" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive: isActive(item.url) })}`}
                    >
                      <item.icon className="w-5 h-5 min-w-[20px]" />
                      {open && (
                        <span className="ml-3 font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <div className="mt-auto pt-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="p-0">
                <NavLink 
                  to="/settings" 
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${getNavCls({ isActive: isActive("/settings") })}`}
                >
                  <Settings className="w-5 h-5 min-w-[20px]" />
                  {open && (
                    <span className="ml-3 font-medium">Settings</span>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}