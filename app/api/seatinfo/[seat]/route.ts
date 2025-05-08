import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const GET = async (request: Request, { params }: { params: Promise<{ seat: string }> }) => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session?.user.id) return new Response("You are not signed in.", { status: 400 });

	const { seat } = await params;
	console.log(seat);

	const existing = await db.query.seat.findFirst({
		where: (s, { eq }) => (eq(s.id, Number(seat))),
		with: {
			user: {
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