import Title from "@/components/title";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOut from "./sign-out";

export default async function Profile() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return redirect("/");

	return (
		<>
			<Title>{session.user.email}</Title>
			<p className="text-sm text-foreground-muted">Your email is {session.user.emailVerified ? "verified" : "not verified"}.</p>
			<div>
				<SignOut />
			</div>
		</>
	)
}