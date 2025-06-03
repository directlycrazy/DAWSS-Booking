import Title, { Subtitle } from "@/components/title";
import { db } from "@/drizzle/db";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { count, eq, isNotNull } from "drizzle-orm";
import { user as userSchema } from "@/drizzle/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUser } from "@/lib/auth-server";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
	title: "Statistics"
}

export default async function AdminStats() {
	const user = await getUser(await headers());

	if (!user || !user.role) return redirect("/login");

	const totalUsers = await db.select({ count: count() }).from(userSchema);
	const totalAttending = await db.select({ count: count() }).from(userSchema).where(eq(userSchema.attending, true));
	const totalGuests = await db.select({ count: count() }).from(userSchema).where(eq(userSchema.hasGuest, true));
	const totalBooked = await db.select({ count: count() }).from(userSchema).where(isNotNull(userSchema.tableId));

	return (
		<>
			<div>
				<Title>Statistics</Title>
				<Subtitle>See information about users and their bookings.</Subtitle>
			</div>
			<Separator className="my-4" />
			<div className="max-w-[800px] mt-2">
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-y-2 lg:gap-y-0 md:gap-x-2">
					<Card className="gap-0 w-full">
						<CardHeader className="text-sm text-muted-foreground">
							Total Users
						</CardHeader>
						<CardContent>
							<h1 className="text-3xl font-bold">{totalUsers[0].count}</h1>
						</CardContent>
					</Card>
					<Card className="gap-0 w-full">
						<CardHeader className="text-sm text-muted-foreground">
							Total Attendees
						</CardHeader>
						<CardContent>
							<h1 className="text-3xl font-bold">{totalAttending[0].count}</h1>
						</CardContent>
					</Card>
					<Card className="gap-0 w-full">
						<CardHeader className="text-sm text-muted-foreground">
							Total Booked
						</CardHeader>
						<CardContent>
							<h1 className="text-3xl font-bold">{totalBooked[0].count}</h1>
						</CardContent>
					</Card>
					<Card className="gap-0 w-full">
						<CardHeader className="text-sm text-muted-foreground">
							Total Guests
						</CardHeader>
						<CardContent>
							<h1 className="text-3xl font-bold">{totalGuests[0].count}</h1>
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	)
}