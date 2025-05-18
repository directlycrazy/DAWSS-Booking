import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session?.user.id) return new Response("You are not signed in.", { status: 400 });

	const tables = await db.query.table.findMany({
		with: {
			users: {
				columns: {
					name: true
				}
			}
		}
	})

	return new Response(JSON.stringify(tables), {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}