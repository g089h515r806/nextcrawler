"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  /*
  user: {
    name: "shadcn",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  },
  */
  navMain: [
    {
      title: "采集管理",
      url: "/admin/feed",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "种子管理",
          url: "/admin/feed",
        },
        {
          title: "模板管理",
          url: "/admin/template",
        },
        {
          title: "数据条目",
          url: "/admin/item",
        },
        {
          title: "分页列表",
          url: "/admin/listpage",
        },		
      ],
    },
    {
      title: "系统管理",
      url: "#",
      icon: Bot,
	  isActive: true,
      items: [
        {
          title: "用户管理",
          url: "/admin/user",
        },
        {
          title: "日志管理",
          url: "/admin/log",
        },
        {
          title: "代理管理",
          url: "/admin/proxy",
        },		
        {
          title: "系统配置",
          url: "/admin/config/system",
        },
      ],
    },


  ],

}

export function AppSidebar({
  user,
  ...props
}) {
  return (

	
	<Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="text-left font-bold text-2xl">
        <div className="ml-4">Next Crawler</div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        
      </SidebarContent>
      <SidebarFooter>
       <NavUser user={user}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
