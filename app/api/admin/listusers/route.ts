import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session?.user.id) return new Response("You are not signed in.", { status: 400 });

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session.user.id))
	})

	if (!user) return new Response("You are not signed in.", { status: 400 });

	if (!user.role) return new Response("You are not signed in.", { status: 400 });

	const users = await db.query.user.findMany({
		// with: {
		// 	seats: true
		// }
	})

	return new Response(JSON.stringify(users), {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}