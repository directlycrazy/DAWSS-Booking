import Title from "@/components/title";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";
import UserTable from './user-table';

export default async function Admin() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) return redirect("/");

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
	})

	if (!user || !user.role) return redirect("/");

	return (
		<>
			<Title>Admin</Title>
			<UserTable />
		</>
	)
}