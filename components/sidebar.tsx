"use client";

import { Home, MapPin, Settings, ShieldHalf, TicketCheck, User } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
	{
		title: "Home",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Venue",
		url: "/dashboard/venue",
		icon: MapPin,
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
	const pathname = usePathname();

	return (
		<Sidebar collapsible="none" className="hidden md:flex border-r min-h-full max-w-[200px] h-svh">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
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
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										isActive={"/dashboard/admin" === pathname}
									>
										<Link href="/dashboard/admin">
											<ShieldHalf />
											<span>Admin</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</>}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
