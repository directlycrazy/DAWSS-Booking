import Title from "@/components/title";
import { Seat } from "./seat";
import { Separator } from "@/components/ui/separator";
import SeatsGrid from "./seats-grid";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Book() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return redirect("/");

	return (
		<>
			<div>
				<Title>Book Your Spot</Title>
				<p className="text-muted-foreground">Click anywhere on the grid to book a spot or see who has already booked it.</p>
			</div>
			<SeatsGrid currentUserId={session.user.id} />
			<Separator />
			<div className="space-y-2">
				<p className="text-muted-foreground">Legend</p>
				<p className="items-center flex gap-x-2 text-sm text-muted-foreground"><Seat initialBooked={false} /> <span>indicates an <b>available spot</b>.</span></p>
				<p className="items-center flex gap-x-2 text-sm text-muted-foreground"><Seat initialBooked={true} /> <span>indicates a <b>taken spot</b>.</span></p>
			</div>
		</>
	)
}