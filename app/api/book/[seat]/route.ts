import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { seat as seatSchema, user as userSchema } from '@/drizzle/schema';
import { eq } from "drizzle-orm";

export const GET = async (request: Request, { params }: { params: Promise<{ seat: string }> }) => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session?.user.id) return new Response("You are not signed in.", { status: 400 });

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session.user.id))
	})

	if (!user) return new Response("You are not signed in.", { status: 400 });

	console.log(user)

	const { seat } = await params;
	console.log(seat);

	const existing = await db.query.seat.findFirst({
		where: (s, { eq }) => (eq(s.id, Number(seat))),
	})

	console.log(existing);

	if (existing && existing.userId) return new Response("Seat has already been booked. Please try again", { status: 500 });

	await db.update(userSchema).set({ seatId: Number(seat) }).where(eq(userSchema.id, session.user.id));

	if (user.seatId) {
		//Remove existing booking
		await db.update(seatSchema).set({ userId: null }).where(eq(seatSchema.id, user.seatId));
	}

	await db.update(seatSchema).set({ userId: session.user.id }).where(eq(seatSchema.id, Number(seat)));

	return new Response("Successfully booked.", { status: 200 });
}