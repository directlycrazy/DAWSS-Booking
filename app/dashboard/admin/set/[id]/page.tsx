import SeatsGrid from "@/app/dashboard/(book)/seats-grid";
import Title, { Subtitle } from "@/components/title";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export default async function AdminSet({ params }: { params: Promise<{ id: string }> }) {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) return redirect("/login");

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
	})

	if (!user || !user.role) return redirect("/login");

	const { id } = await params;

	if (!id) return <>User does not exist.</>;

	const referencedUser = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, id)),
	})

	if (!referencedUser) return <>User does not exist.</>;

	return (
		<>
			<div>
				<Title>Manual Edit</Title>
				<Subtitle>Choose where to place this person. If a seat is already taken, it will remove the booking of the existing person.</Subtitle>
			</div>
			<SeatsGrid userId={id} currentUserHasGuest={referencedUser.hasGuest || false} currentUserRole={user.role || false} />
		</>
	)
}