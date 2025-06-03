import Title, { Subtitle } from "@/components/title";
import { headers } from "next/headers"
import { redirect } from "next/navigation";
import UserTable from './user-table';
import { Metadata } from "next";
import { getUser } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "Admin"
};

export default async function Admin() {
	const user = await getUser(await headers());

	if (!user || !user.role) return redirect("/login");

	return (
		<>
			<div>
				<Title>User List</Title>
				<Subtitle>Tick &quot;attending&quot; to allow the user to book a seat. Use the actions on the right side to remove a user&apos;s booking, or set it for them.</Subtitle>
			</div>
			<UserTable />
		</>
	)
}