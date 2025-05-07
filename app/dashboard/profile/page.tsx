import Title from "@/components/title";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Profile() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return;

	return (
		<>
			<Title>{session.user.email}</Title>
			<p className="text-sm text-foreground-muted">Your email is {session.user.emailVerified ? "verified" : "not verified"}.</p>
			<div>
				<Button variant="destructive">Sign Out</Button>
			</div>
		</>
	)
}