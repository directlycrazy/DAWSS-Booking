"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
	const pathname = usePathname();

	return (
		<>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem className="hidden md:block">
						<BreadcrumbLink href="/dashboard">Booking</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="hidden md:block" />
					<BreadcrumbItem>
						<BreadcrumbPage>{pathname === "/" ? "Login" : "Student Dashboard"}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</>
	)
}