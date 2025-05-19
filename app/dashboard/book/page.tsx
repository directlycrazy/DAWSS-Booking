import SeatsGrid from "./seats-grid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";

interface CurrentUserWithTableType {
	id: string;
	name: string | null; 
	email: string;
	role: boolean | null;
	attending: boolean | null;
	hasGuest: boolean | null; 
	tableId: number | null;
	table: {
		id: number;
		users: {
			id: string;
			name: string | null;
			email: string;
			role: boolean | null;
			attending: boolean | null;
			tableId: number | null;
			hasGuest: boolean | null; 
		}[];
	} | null; 
}


export default async function Book() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user.id) { 
		return redirect("/login");
	}

	const currentUserData: CurrentUserWithTableType | undefined = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, session.user.id),
		columns: { 
			id: true,
			name: true,
			email: true,
			role: true,
			attending: true,
			hasGuest: true, 
			tableId: true,
		},
		with: {
			table: { 
				columns: {
					id: true,
				},
				with: {
					users: { 
						columns: {
							id: true,
							name: true,
							email: true,
							role: true,
							attending: true,
							tableId: true,
							hasGuest: true,
						}
					}
				}
			}
		}
	});

	if (!currentUserData) {
		console.error("Current user data not found even with a session.");
		return redirect("/login"); 
	}

	let initialTableData = null;
	if (currentUserData.table) { 
		initialTableData = {
			id: currentUserData.table.id,
			users: currentUserData.table.users.map(user => ({
				id: user.id,
				name: user.name ?? 'Unknown User', 
				email: user.email,
				role: user.role ?? false,
				attending: user.attending ?? false,
				tableId: user.tableId,
				hasGuest: user.hasGuest ?? false,
			}))
		};
	}
	
	return (
		<div className="md:-m-6 p-0"> 
			<SeatsGrid
				currentUserId={session.user.id}
				currentUserHasGuest={currentUserData.hasGuest ?? false} 
				initialTableData={initialTableData}
				currentUserTableId={currentUserData.tableId}
			/>
		</div>
	);
}
