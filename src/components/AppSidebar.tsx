import { Circle, History, Settings, Sparkles, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";

const chatHistories = [
  { id: 1, title: "AI Basics Discussion", date: "2 days ago" },
  { id: 2, title: "Project Planning", date: "1 week ago" },
  { id: 3, title: "Code Review Session", date: "2 weeks ago" },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset" collapsible="offcanvas" className="border-r border-border flex flex-col">
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold">Nova Scribe</h1>
        <Button variant="outline" className="w-full bg-transparent justify-start gap-2 rounded-full border mt-4">
          <Sparkles className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4">Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatHistories.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <NavLink to={`/chat/${chat.id}`} className={({ isActive }) =>
                      `flex items-center px-4 py-8 rounded-md ${isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}`}>

                      <History className="mr-3 h-4 w-4" />
                      <div className="flex flex-col overflow-hidden space-y-1">
                        <span className="truncate">{chat.title}</span>
                        <span className="text-xs text-muted-foreground">{chat.date}</span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        

      </SidebarContent>
      
      <SidebarFooter className="mt-auto border-t p-4">

        <div className="space-y-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/#settings" className={({ isActive }) =>
                `flex items-center px-4 py-6 rounded-md ${isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}`}>

                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/#profile" className={({ isActive }) =>
                `flex items-center px-4 py-6 rounded-md ${isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"}`}>

                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <Separator className="my-2" />
          
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
