import { getSessionUser } from '@/lib/session'
import { AppSidebar } from "@/components/app-sidebar"
//import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default async function DashboardLayout({ children }) {
  let user = await getSessionUser();
  if(user == null){
	  user = {
		 name:"匿名"
	  }
  }
  
  return (
    <SidebarProvider>
      <AppSidebar user={user}/>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
