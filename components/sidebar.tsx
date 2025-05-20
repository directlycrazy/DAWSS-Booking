"use client"

import * as React from "react"
import {
	Earth,
	House,
	Info,
	Settings2,
	TicketCheck,
	User,
} from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./sidebar/nav-user"
import { NavMain } from "./sidebar/nav-main"
import Link from "next/link"
import { NavSecondary } from "./sidebar/nav-secondary"

const data = {
	navMain: [
		{
			name: "Home",
			url: "/",
			icon: House,
		},
		{
			name: "Book",
			url: "/dashboard",
			icon: TicketCheck,
		},
		{
			name: "Profile",
			url: "/dashboard/profile",
			icon: User,
		},
		{
			name: "Website",
			url: "https://sites.google.com/ddsb.ca/dawssgradsocial/home",
			icon: Earth,
			newTab: true
		}
	],
	navSecondary: [
		{
			title: "About",
			url: "/dashboard/about",
			icon: Info,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings2,
		},
	]
}

export default function AppSidebar({ user, ...props }: { user: { name: string, email: string, role: boolean | null } }) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<TicketCheck className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Wilson {new Date().getFullYear()}</span>
									<span className="truncate text-xs">Grad Social Booking</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} role={user.role ?? false} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
		</Sidebar>
	)
}
