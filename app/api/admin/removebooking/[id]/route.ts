import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { user as userSchema, table as tableSchema } from '@/drizzle/schema';

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session?.user.id) return new Response("You are not signed in.", { status: 400 });

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session.user.id))
	})

	if (!user) return new Response("You are not signed in.", { status: 400 });

	if (!user.role) return new Response("You are not signed in.", { status: 400 });

	const { id } = await params;
	const updatedUser = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, id))
	})

	if (!updatedUser) return;
	if (!updatedUser.tableId) return;

	// await db.update(seatSchema).set({ userId: null }).where(eq(seatSchema.id, updatedUser.seatId));
	await db.update(userSchema).set({ tableId: null }).where(eq(userSchema.id, id));

	return new Response("Success", {
		status: 200
	});
}