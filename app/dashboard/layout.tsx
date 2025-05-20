import Sidebar from "@/components/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbs from "@/components/breadcrumbs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import ShowSidebar from "./showSidebar";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
	})

	if (!user) return redirect("/login");

	return (
		<SidebarProvider>
			<Sidebar user={user} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumbs />
					</div>
				</header>
				<div className='m-6'>
					{children}
				</div>
			</SidebarInset>
			<ShowSidebar />
		</SidebarProvider>
	);
}
