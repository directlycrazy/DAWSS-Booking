import SeatsGrid from "./seats-grid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/drizzle/db";

export default async function Book() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user.id) {
		return redirect("/login");
	}

	const currentUserData = await db.query.user.findFirst({
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
	});

	if (!currentUserData) {
		console.error("Current user data not found even with a session.");
		return redirect("/login");
	}

	return (
		<div>
			<SeatsGrid
				currentUserId={session.user.id}
				currentUserHasGuest={currentUserData.hasGuest ?? false}
				initialTableId={currentUserData.tableId}
				currentUserTableId={currentUserData.tableId}
				currentUserRole={currentUserData.role ?? false}
			/>
		</div>
	);
}
