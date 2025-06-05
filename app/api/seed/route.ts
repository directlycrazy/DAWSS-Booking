import { db } from "@/drizzle/db";
import { user as userSchema } from '@/drizzle/schema';
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { createRandomString } from "@/lib/utils";
import { getUser } from "@/lib/auth-server";
import { writeLog } from "@/lib/log";

export const GET = async (request: NextRequest) => {
	const loggedInUser = await getUser(await headers());

	if (!loggedInUser || loggedInUser.role !== true) return new Response("You do not have permission to access this route.", { status: 401 });

	const email = request.nextUrl.searchParams.get("email");
	const name = request.nextUrl.searchParams.get("name");

	if (!email || !name) {
		return NextResponse.json({ message: "Email and name are required." }, { status: 400 });
	}

	try {
		const existingUser = await db.query.user.findFirst({
			where: eq(userSchema.email, email),
		});

		if (existingUser) {
			return NextResponse.json({ message: `User with email ${email} already exists.` }, { status: 409 });
		}

		const id = createRandomString(25);
		const time = new Date();

		await db.insert(userSchema).values({
			id: id,
			email: email,
			name: name,
			emailVerified: true,
			createdAt: time,
			updatedAt: time,
		});

		await writeLog(`The user ${name} has been created.`, "System");

		return NextResponse.json({ message: `User ${name} added successfully.` }, { status: 201 });

	} catch {
		return NextResponse.json({ message: "Failed to process user." }, { status: 500 });
	}
}