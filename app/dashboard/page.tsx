import Title from "@/components/title";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { auth } from "@/lib/auth"
import { Info, MapPin, TicketCheck } from "lucide-react";
import { headers } from "next/headers"
import Link from "next/link";

export default async function Student() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return;

	return (
		<>
			<Title>Welcome, {session.user.name}.</Title>
			<Alert variant="default">
				<Info className="h-4 w-4" />
				<AlertTitle>Your selection is currently not submitted.</AlertTitle>
				<AlertDescription>
					<p>Booking is still open until June 4th. <Link className="font-bold underline" href="/dashboard/book">Submit Now</Link></p>
				</AlertDescription>
			</Alert>

			<div className="flex w-full gap-x-2">
				<Link href="/dashboard/book" className="w-full">
					<Card className="gap-0">
						<CardContent>
							<TicketCheck className="w-10 h-10" />
							<h1 className="text-lg font-bold">Book Your Spot</h1>
							<p>Click Here</p>
						</CardContent>
					</Card>
				</Link>
				<Link href="/dashboard/venue" className="w-full">
					<Card className="gap-0">
						<CardContent>
							<MapPin className="w-10 h-10" />
							<h1 className="text-lg font-bold">Venue Details</h1>
							<p>Click Here</p>
						</CardContent>
					</Card>
				</Link>
			</div>

			<div className="flex w-full gap-x-2">
				<Card className="gap-0 w-full">
					<CardHeader className="text-sm text-muted-foreground">
						Total Attendees
					</CardHeader>
					<CardContent>
						<h1 className="text-3xl font-bold">124</h1>
					</CardContent>
				</Card>
				<Card className="gap-0 w-full">
					<CardHeader className="text-sm text-muted-foreground">
						Remaining Seats
					</CardHeader>
					<CardContent>
						<h1 className="text-3xl font-bold">53</h1>
					</CardContent>
				</Card>
			</div>
		</>
	)
}