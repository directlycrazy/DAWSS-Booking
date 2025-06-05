import Title, { Subtitle } from "@/components/title";
import { db } from "@/drizzle/db";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth-server";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
	title: "Audit Log"
}

export default async function AuditLog() {
	const user = await getUser(await headers());

	if (!user || !user.role) return redirect("/login");

	const logs = await db.query.log.findMany({
		limit: 250,
		orderBy: (logs, { desc }) => [desc(logs.createdAt)]
	})

	return (
		<>
			<div>
				<Title>Event Log</Title>
				<Subtitle>See a detailed log of changes to the application.</Subtitle>
			</div>
			<Separator className="my-4" />
			<Table>
				<TableCaption>The 250 most recent actions.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="font-bold">Initiator</TableHead>
						<TableHead className="font-bold">Message</TableHead>
						<TableHead className="text-right font-bold">Time</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{logs.map((log, i) => <TableRow key={i}>
						<TableCell>{log.initiator}</TableCell>
						<TableCell>{log.message}</TableCell>
						<TableCell className="text-right">{log.createdAt ? log.createdAt.toLocaleString() : "Unknown"}</TableCell>
					</TableRow>)}
				</TableBody>
			</Table>
		</>
	)
}