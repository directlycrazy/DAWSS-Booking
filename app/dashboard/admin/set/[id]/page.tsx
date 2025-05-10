import SeatsGrid from "@/app/dashboard/book/seats-grid";
import Title from "@/components/title";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export default async function AdminSet({ params }: { params: Promise<{ id: string }> }) {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) return redirect("/");

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
	})

	if (!user || !user.role) return redirect("/");

	const { id } = await params;

	return (
		<>
			<Title>Manually Edit</Title>
			<p className="text-sm -mt-4">Choose where to place this person. If a seat is already taken, it will remove the booking of the existing person.</p>
			<SeatsGrid userId={id} />
		</>
	)
}