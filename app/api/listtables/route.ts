import { db } from "@/drizzle/db";
import { getSession } from "@/lib/auth-server";
import { headers } from "next/headers";

export const GET = async () => {
	const session = await getSession(await headers());

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
