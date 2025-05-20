"use client"

import {
	Users,
	type LucideIcon,
} from "lucide-react"
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
	items,
	role
}: {
	items: {
		name: string
		url: string
		icon: LucideIcon,
		newTab?: boolean
	}[],
	role: boolean
}) {
	const { setOpenMobile } = useSidebar();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.name} onClick={() => setOpenMobile(false)}>
						<SidebarMenuButton asChild>
							<Link href={item.url} target={item.newTab ? "_blank" : ""}>
								<item.icon />
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
				{role === true && <SidebarMenuItem key="admin" onClick={() => setOpenMobile(false)}>
					<SidebarMenuButton asChild>
						<Link href="/dashboard/admin">
							<Users />
							<span>Admin</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>}
			</SidebarMenu>
		</SidebarGroup>
	)
}
