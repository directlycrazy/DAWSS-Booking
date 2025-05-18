import SeatsGrid from "./seats-grid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";

export default async function Book() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return redirect("/login");

	const currentUserWithTable = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, session.user.id),
		with: {
			table: {
				with: {
					users: {
						columns: {
							id: true,
							name: true,
							email: true,
							role: true,
							attending: true,
							tableId: true,
						}
					}
				}
			}
		}
	})

	let initialTableData = null;
	if(currentUserWithTable && currentUserWithTable.table && currentUserWithTable.table.users) {
		initialTableData = {
			id: currentUserWithTable.table.id,
			users: currentUserWithTable.table.users.map(user => ({ 
				id: user.id, 
				name: user.name,
				email: user.email,
				role: user.role ?? false,
				attending: user.attending ?? false,
				tableId: user.tableId === null ? undefined : user.tableId,
			}))
		}
	}
	else if (currentUserWithTable && currentUserWithTable.table) {
		initialTableData = {
			id: currentUserWithTable.table.id,
			users: []
		}
	}

	console.log(currentUserWithTable)

	return (
		<div className="-m-4 -p-4 ">
			<SeatsGrid
				currentUserId={session.user.id}
				initialTableData={initialTableData}
				currentUserTableId={currentUserWithTable?.tableId}></SeatsGrid>
		</div>
	)
}