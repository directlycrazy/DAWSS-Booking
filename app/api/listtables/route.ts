import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user.id) {
		return new Response(JSON.stringify([]), {
			status: 401, 
			headers: { "content-type": "application/json" }
		});
	}

	const tables = await db.query.table.findMany({
		with: {
			users: {
				columns: {
					id: true, 
					name: true,
					hasGuest: true 
				}
			}
		}
	});

	return new Response(JSON.stringify(tables), {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}
