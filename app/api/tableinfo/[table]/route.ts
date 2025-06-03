import { db } from "@/drizzle/db";
import { getSession } from "@/lib/auth-server";
import { headers } from "next/headers";

export const GET = async (request: Request, { params }: { params: Promise<{ table: string }> }) => {
	const session = await getSession(await headers());

	if (!session?.user.id) {
		return new Response(JSON.stringify(null), {
			status: 401,
			headers: { "content-type": "application/json" }
		});
	}

	const { table: tableIdString } = await params;
	const tableId = Number(tableIdString);

	if (isNaN(tableId)) {
		return new Response(JSON.stringify({ error: "Invalid table ID" }), {
			status: 400, headers: { "content-type": "application/json" }
		});
	}

	const existingTableInfo = await db.query.table.findFirst({
		where: (t, { eq }) => (eq(t.id, tableId)),
		with: {
			users: {
				columns: {
					id: true,
					name: true,
					email: true,
					role: true,
					attending: true,
					hasGuest: true,
				}
			}
		}
	});

	if (!existingTableInfo) {
		return new Response(JSON.stringify(null), {
			status: 404,
			headers: { "content-type": "application/json" }
		});
	}

	return new Response(JSON.stringify(existingTableInfo), {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}
