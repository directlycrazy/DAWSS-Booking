import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { NextRequest } from "next/server";

function createRandomString(length: number) {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export const GET = async (request: NextRequest) => {
	if (process.env.NODE_ENV === "production") return;
	const id = createRandomString(25);
	console.log(id)
	const time = new Date()
	const res = await db.insert(user).values({
		id: id,
		email: request.nextUrl.searchParams.get("email"),
		name: request.nextUrl.searchParams.get("name"),
		emailVerified: 1,
		createdAt: time,
		updatedAt: time,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any)

	console.log(res)

	return new Response("Success.", {
		status: 200, headers: {
			"content-type": "application/json"
		}
	});
}