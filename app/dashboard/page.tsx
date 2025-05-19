import Title from "@/components/title";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth"
import { Info, MapPin, Settings, ShieldHalf, TicketCheck, User } from "lucide-react";
import { headers } from "next/headers"
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Student() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return redirect("/login");

	const booked = await db.query.user.findFirst({
		where: (user, { eq }) => (eq(user.id, session.user.id)),
		with: {
			table: true
		}
	});

	if (!booked) return redirect("/login");

	const submitted = booked?.tableId;

	return (
		<div className="space-y-2">
			<Title>Welcome, {session.user.name}.</Title>
			<Alert variant="default">
				<Info className="h-4 w-4" />
				<AlertTitle>Your selection is currently <b>{submitted ? "submitted!" : "not submitted."}</b></AlertTitle>
				<AlertDescription>
					{submitted ? <p>You may still make changes until June 4th.</p> : <p>Booking is still open until June 4th. <Link className="font-bold underline" href="/dashboard/book">Submit Now</Link></p>}
				</AlertDescription>
			</Alert>

			<div className="flex flex-col lg:flex-row w-full gap-y-2 lg:gap-y-0 lg:gap-x-2">
				<Link href="/dashboard/book" className="w-full">
					<Card className="gap-0">
						<CardContent>
							<TicketCheck className="w-10 h-10" />
							<h1 className="text-lg font-bold">Book Your Spot</h1>
							<p className="text-sm text-muted-foreground">Tap to book your spot.</p>
						</CardContent>
					</Card>
				</Link>
				<Link href="/dashboard/profile" className="w-full">
					<Card className="gap-0">
						<CardContent>
							<User className="w-10 h-10" />
							<h1 className="text-lg font-bold">Your Profile</h1>
							<p className="text-sm text-muted-foreground">Tap to see your profile.</p>
						</CardContent>
					</Card>
				</Link>
				<Link href="/dashboard/settings" className="w-full">
					<Card className="gap-0">
						<CardContent>
							<Settings className="w-10 h-10" />
							<h1 className="text-lg font-bold">Settings</h1>
							<p className="text-sm text-muted-foreground">Tap to change app settings.</p>
						</CardContent>
					</Card>
				</Link>
				{booked.role && <Link href="/dashboard/admin" className="w-full">
					<Card className="gap-0">
						<CardContent>
							<ShieldHalf className="w-10 h-10" />
							<h1 className="text-lg font-bold">Admin</h1>
							<p className="text-sm text-muted-foreground">Tap to administrate the application.</p>
						</CardContent>
					</Card>
				</Link>}
			</div>
		</div>
	)
}