import { db } from "@/drizzle/db";
import { getUser } from "@/lib/auth-server";
import { headers } from "next/headers";

export const GET = async () => {
	const user = await getUser(await headers());

	if (!user) return new Response("You are not signed in.", { status: 400 });

	if (!user.role) return new Response("You are not signed in.", { status: 400 });

	const users = await db.query.user.findMany({
		with: {
			table: true
		}
	})

	return new Response(JSON.stringify(users), {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}