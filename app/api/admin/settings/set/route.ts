import { db } from "@/drizzle/db";
import { settings } from "@/drizzle/schema";
import { getUser } from "@/lib/auth-server";
import { writeLog } from "@/lib/log";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
	const user = await getUser(await headers());

	if (!user) return new Response("You are not signed in.", { status: 400 });

	if (!user.role) return new Response("You are not signed in.", { status: 400 });

	const data = await request.json();
	if (!data) return;

	const existing = await db.query.settings.findFirst({
		where: (s, { eq }) => (eq(s.id, data.id))
	})

	if (existing) {
		await db.update(settings).set({ value: data.value }).where(eq(settings.id, existing.id));
	} else {
		await db.insert(settings).values(data);
	}

	await writeLog(`Setting "${data.id}" changed.`, "System");

	return new Response("Successfully changed.", {
		status: 200
	});
}