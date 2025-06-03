import SeatsGrid from "./seats-grid";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getOnboarding, getUser } from "@/lib/auth-server";

export const metadata: Metadata = {
	title: "Book"
};

export default async function Book() {
	if (await getOnboarding()) return redirect("/onboarding");

	const user = await getUser(await headers());

	if (!user) {
		return redirect("/login");
	}

	return (
		<div>
			<SeatsGrid
				currentUserId={user.id}
				currentUserHasGuest={user.hasGuest ?? false}
				initialTableId={user.tableId}
				currentUserTableId={user.tableId}
				currentUserRole={user.role ?? false}
				showTitle={true}
			/>
		</div>
	);
}
