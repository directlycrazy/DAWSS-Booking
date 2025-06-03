import Sidebar from "@/components/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Breadcrumbs from "@/components/breadcrumbs";
import { headers } from "next/headers";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import ShowSidebar from "./showSidebar";
import { getUser } from "@/lib/auth-server";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getUser(await headers());

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
			<ShowSidebar currentUserId={user.id}
				currentUserHasGuest={user.hasGuest ?? false}
				initialTableId={user.tableId}
				currentUserTableId={user.tableId}
				currentUserRole={user.role ?? false} />
		</SidebarProvider>
	);
}
