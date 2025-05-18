import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { user as userSchema, table as tableSchema } from '@/drizzle/schema';
import { eq, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ table: string }> }) => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session?.user.id) return new Response("You are not signed in.", { status: 400 });

	let user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session.user.id))
	})

	if (!user) return new Response("You are not signed in.", { status: 400 });
	if (!user.attending) return new Response("You have not been marked as attending the social. Please talk to a member of faculty to be able to book.", { status: 400 });

	console.log(user)

	const { table } = await params;
	console.log(table);

	//Check for custom user
	let userId = session.user.id;
	const reqUser = request.nextUrl.searchParams.get("user");
	if (reqUser) {
		//Requires auth to modify other users
		if (user.role) userId = reqUser;
		user = await db.query.user.findFirst({
			where: (s, { eq }) => (eq(s.id, userId))
		})
	}

	const existing = await db.query.table.findFirst({
		where: (t, { eq }) => (eq(t.id, Number(table))),
		with: {
			users: true
		}
	})

	console.log(existing);

	if (existing && existing.users.length >= 10) {
		// if (reqUser) {
		//Overwrite initiated from admin
		// await db.update(userSchema).set({ seatId: null }).where(eq(userSchema.id, existing.userId));
		// await db.update(seatSchema).set({ userId: null }).where(eq(seatSchema.id, existing.id));
		// } else {
		return new Response("This table is full. Please try again", { status: 500 });
		// }
	}

	await db.update(userSchema).set({ tableId: Number(table) }).where(eq(userSchema.id, userId));

	if (user && user.tableId) {
		//Remove existing booking
		// db.delete(tableSchema).where(inArray(tableSchema.users, ))
		// await db.update(tableSchema).set({ userId: null }).where(eq(seatSchema.id, user.seatId));
	}

	// await db.update(seatSchema).set({ userId: userId }).where(eq(seatSchema.id, Number(seat)));

	return new Response("Successfully booked.", { status: 200 });
}