"use client";

import { ChevronDown, Home, LayoutDashboard, Settings, TicketCheck, User, Users } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Book",
		url: "/dashboard/book",
		icon: TicketCheck,
	},
	{
		title: "Profile",
		url: "/dashboard/profile",
		icon: User,
	},
	{
		title: "Settings",
		url: "/dashboard/settings",
		icon: Settings,
	},
]

export default function AppSidebar({ admin }: { admin: boolean }) {
	const { setOpenMobile } = useSidebar();
	const pathname = usePathname();

	return (
		<Sidebar className="hidden md:flex border-r min-h-full">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title} onClick={() => setOpenMobile(false)}>
									<SidebarMenuButton
										asChild
										isActive={item.url === pathname}
									>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							{admin && <>

							</>}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{admin && <Collapsible defaultOpen className="group/collapsible">
					<SidebarGroup>
						<SidebarGroupLabel asChild>
							<CollapsibleTrigger>
								Admin
								<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
							</CollapsibleTrigger>
						</SidebarGroupLabel>
						<CollapsibleContent>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem onClick={() => setOpenMobile(false)}>
										<SidebarMenuButton
											asChild
											isActive={"/dashboard/admin" === pathname}
										>
											<Link href="/dashboard/admin">
												<Users />
												<span>User List</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</CollapsibleContent>
					</SidebarGroup>
				</Collapsible>}
			</SidebarContent>
		</Sidebar>
	)
}
