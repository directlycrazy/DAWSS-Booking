import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { user as userSchema } from '@/drizzle/schema';
import { getUser } from "@/lib/auth-server";
import { writeLog } from "@/lib/log";

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
	const user = await getUser(await headers());

	if (!user) return new Response("You are not signed in.", { status: 400 });

	if (!user.role) return new Response("You are not signed in.", { status: 400 });

	const { id } = await params;
	const updatedUser = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, id))
	})

	if (!updatedUser) return;

	await writeLog(`${updatedUser.name} has had their attending status changed.`, "System");
	await db.update(userSchema).set({ attending: !updatedUser.attending }).where(eq(userSchema.id, id));

	return new Response("Success", {
		status: 200
	});
}