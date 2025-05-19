import { db } from "@/drizzle/db";
import { table } from "@/drizzle/schema";

export const GET = async () => {
	if (process.env.NODE_ENV === "production") return;

	for (let i = 0; i < 20; i++) {
		await db.insert(table)
	}

	return new Response("Success.", {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}