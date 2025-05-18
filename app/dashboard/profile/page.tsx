import Title, { Subtitle } from "@/components/title";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignOut from "./sign-out";

export default async function Profile() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (!session) return redirect("/login");

	return (
		<>
			<div>
				<Title>{session.user.email}</Title>
				<Subtitle>Your email is {session.user.emailVerified ? "verified" : "not verified"}.</Subtitle>
			</div>
			<div>
				<SignOut />
			</div>
		</>
	)
}