import Title, { Subtitle } from "@/components/title";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUser } from "@/lib/auth-server";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
	title: "Actions"
}

export default async function AdminStats() {
	const user = await getUser(await headers());

	if (!user || !user.role) return redirect("/login");

	return (
		<>
			<div>
				<Title>Actions</Title>
				<Subtitle>Click any of the buttons below to change features in the application. Each of these actions <b>are not reversible. Do not click any action more than once, until a notification is seen.</b></Subtitle>
			</div>
			<Separator className="my-4" />
			<div className="max-w-[800px] mt-2">
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-2 lg:gap-y-0 md:gap-x-2">
					Coming Soon...
					{/* <Card className="gap-0 w-full">
						<CardHeader className="text-sm text-muted-foreground">
							Table Actions
						</CardHeader>
						<CardContent>
							<Button>Purge Unused Tables</Button>
						</CardContent>
					</Card> */}
				</div>
			</div>
		</>
	)
}