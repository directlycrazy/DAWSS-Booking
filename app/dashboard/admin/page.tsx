import Title, { Subtitle } from "@/components/title";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";
import UserTable from './user-table';

export default async function Admin() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) return redirect("/login");

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
	})

	if (!user || !user.role) return redirect("/login");

	return (
		<>
			<div>
				<Title>User List</Title>
				<Subtitle>Tick &quot;attending&quot; to allow the user to book a seat. Use the actions on the right side to remove a user&apos;s booking, or set it for them.</Subtitle>
			</div>
			<UserTable />
		</>
	)
}