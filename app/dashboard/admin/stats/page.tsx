import Title from "@/components/title";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { count, eq, isNotNull } from "drizzle-orm";
import { user as userSchema } from "@/drizzle/schema";

export const metadata: Metadata = {
	title: "Statistics"
}

export default async function AdminStats() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session) return redirect("/login");

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
	})

	if (!user || !user.role) return redirect("/login");

	const totalUsers = await db.select({ count: count() }).from(userSchema);
	const totalAttending = await db.select({ count: count() }).from(userSchema).where(eq(userSchema.attending, true));
	const totalGuests = await db.select({ count: count() }).from(userSchema).where(eq(userSchema.hasGuest, true));
	const totalBooked = await db.select({ count: count() }).from(userSchema).where(isNotNull(userSchema.tableId));

	return (
		<>
			<Title>Statistics</Title>
			<div className="space-y-2">
				<div>
					<p><b>Total Users:</b> {totalUsers[0].count}</p>
					<p><b>Total Attending:</b> {totalAttending[0].count}</p>
					<p><b>Total Guests:</b> {totalGuests[0].count}</p>
					<p><b>Total Booked:</b> {totalBooked[0].count}</p>
				</div>
			</div>
		</>
	)
}