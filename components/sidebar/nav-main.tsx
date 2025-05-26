"use client"

import {
	ChartNoAxesCombined,
	ChevronDown,
	Users,
	type LucideIcon,
} from "lucide-react"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

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
		<>
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
				</SidebarMenu>
			</SidebarGroup>
			{role === true && <Collapsible defaultOpen className="group/collapsible">
				<SidebarGroup>
					<SidebarGroupLabel asChild>
						<CollapsibleTrigger>
							Admin
							<ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
						</CollapsibleTrigger>
					</SidebarGroupLabel>
					<CollapsibleContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/dashboard/admin">
										<Users />
										<span>User List</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/dashboard/admin/stats">
										<ChartNoAxesCombined />
										<span>Statistics</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</CollapsibleContent>
				</SidebarGroup>
			</Collapsible>}
		</>
	)
}
