import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import Actions from "./actions";

export const metadata: Metadata = {
	title: "Actions"
}

export default async function AdminActions() {
	const user = await getUser(await headers());

	if (!user || !user.role) return redirect("/login");

	return (
		<Actions />
	)
}