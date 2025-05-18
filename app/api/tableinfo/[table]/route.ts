import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async (request: Request, { params }: { params: Promise<{ table: string }> }) => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session?.user.id) return new Response("You are not signed in.", { status: 400 });

	const { table } = await params;
	console.log(table);

	const existing = await db.query.table.findFirst({
		where: (t, { eq }) => (eq(t.id, Number(table))),
		with: {
			users: {
				columns: {
					name: true
				}
			}
		}
	})

	console.log(existing);

	return new Response(JSON.stringify(existing), {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}