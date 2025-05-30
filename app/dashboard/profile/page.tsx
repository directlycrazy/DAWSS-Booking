import Title, { Subtitle } from "@/components/title";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOut from "./sign-out";
import { Metadata } from "next";
import { db } from "@/drizzle/db";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Profile"
};

export default async function Profile() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return redirect("/login");

	const user = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
	})

	if (!user) return redirect("/login");

	const submitted = user.tableId;

	return (
		<div className="space-y-2">
			<div>
				<Title>Welcome, {user.name}.</Title>
				<Subtitle>Your email is <b>{user.email}.</b></Subtitle>
			</div>
			<div className="inline-block">
				<Alert variant="default">
					<Info className="h-4 w-4" />
					<AlertTitle>Your selection is currently <b>{submitted ? "submitted!" : "not submitted."}</b></AlertTitle>
					<AlertDescription>
						{submitted ? <p>You may still make changes until June 13th.</p> : <p>Booking is still open until June 13th. <Link className="font-bold underline" href="/dashboard/book">Submit Now</Link></p>}
					</AlertDescription>
				</Alert>
			</div>
			<div>
				<SignOut />
			</div>
		</div>
	)
}