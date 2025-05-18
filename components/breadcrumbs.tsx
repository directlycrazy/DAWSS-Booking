"use client";

import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function Breadcrumbs() {
	const pathname = usePathname();

	const split = pathname.split("/").slice(1, 1000);

	return (
		<>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbLink href="/">
						Grad Social {new Date().getFullYear()}
					</BreadcrumbLink>
					{split[0] !== "" && <BreadcrumbSeparator />}
					{split.map((a, i) => {
						const readable = a.slice(0, 1).toUpperCase() + a.slice(1, 1000);

						return <Fragment key={i}>
							{i === split.length - 1 ? <>
								<BreadcrumbPage>
									{readable}
								</BreadcrumbPage>
							</> : <>
								<BreadcrumbLink href="/dashboard">
									{readable}
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