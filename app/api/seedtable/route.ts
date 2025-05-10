import { db } from "@/drizzle/db";
import { seat, table } from "@/drizzle/schema";

export const GET = async () => {
	if (process.env.NODE_ENV === "production") return;

	for (let i = 0; i < 30; i++) {
		const t = await db.insert(table).values({

		}).returning()

		console.log(t[0].id);

		for (let y = 0; y < 10; y++) {
			await db.insert(seat).values({
				tableId: t[0].id
			})
		}
	}

	return new Response("a", {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}