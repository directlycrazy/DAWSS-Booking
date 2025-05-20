"use client";

import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Breadcrumbs() {
	const pathname = usePathname();

	const split = pathname.split("/").slice(1, 1000);

	return (
		<>
			<Breadcrumb>
				<BreadcrumbList>
					{split.map((a, i) => {
						const readable = a.slice(0, 1).toUpperCase() + a.slice(1, 1000);

						return <Fragment key={i}>
							{i === split.length - 1 ? <>
								<BreadcrumbPage>
									{readable}
								</BreadcrumbPage>
							</> : <>
								<BreadcrumbLink asChild>
									<Link href="/dashboard">
										{readable}
									</Link>
								</BreadcrumbLink>
								{split.length > 1 && <>
									<BreadcrumbSeparator />
								</>}
							</>}
						</Fragment>
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</>
	)
}