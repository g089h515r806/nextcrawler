"use client"

import {
  User,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"

export function NavUser({
  user
}) {
  const { isMobile } = useSidebar()

/*
  const logout = () => {
	
    console.log("logout");
	console.log("cookie",document.cookie);
    let allCookies = document.cookie.split(';');
    console.log("allCookies",allCookies);
	// The "expire" attribute of every cookie is 
	// Set to "Thu, 01 Jan 1970 00:00:00 GMT"
	for (let i = 0; i < allCookies.length; i++)
		document.cookie = allCookies[i] + "=;expires="
			+ new Date(0).toUTCString();

    window.location.href = '/login'; 
  };
  */

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
			    <User />

              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">

                <span className="truncate font-medium">{user.name}</span>

              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
					<User />
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>

                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem  onClick={() => logout()}>
             
 			   <LogOut />
               <a href="/logout">  退出 </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
