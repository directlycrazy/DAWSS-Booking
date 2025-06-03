import { db } from "@/drizzle/db";
import { headers } from "next/headers";
import { table as tableSchema } from '@/drizzle/schema';
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/auth-server";

export const DELETE = async () => {
	const adminUser = await getUser(await headers());

	if (!adminUser || adminUser.role !== true) {
		return NextResponse.json({ message: "You do not have permission to perform this action." }, { status: 403 });
	}

	try {
		let tables = await db.query.table.findMany({
			with: {
				users: true
			}
		})

		for (let i = 0; i < tables.length; i++) {
			if (tables[i].users.length === 0) {
				await db.delete(tableSchema).where(eq(tableSchema.id, tables[i].id));
				console.log(`Purged table ${tables[i].id}`)
			}
		}

		tables = await db.query.table.findMany({
			with: {
				users: true
			}
		})

		for (let i = 0; i < tables.length; i++) {
			await db.update(tableSchema).set({ id: i + 1 }).where(eq(tableSchema.id, tables[i].id));
			console.log(`Retained ${tables[i].id}, now ${i + 1}`)
		}

		return NextResponse.json({ message: "All empty tables purged successfully." }, { status: 200 });
	} catch (error) {
		console.error("Error deleting all users:", error);
		return NextResponse.json({ message: "Failed to purge empty tables." }, { status: 500 });
	}
}