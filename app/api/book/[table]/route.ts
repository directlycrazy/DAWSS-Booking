import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { user as userSchema } from '@/drizzle/schema';
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

const TABLE_CAPACITY = 10;

export const GET = async (request: NextRequest, { params }: { params: Promise<{ table: string }> }) => {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user.id) {
		return new Response("You are not signed in.", { status: 401 });
	}

	const loggedInUser = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, session.user.id))
	});

	if (!loggedInUser) {
		return new Response("Logged-in user not found.", { status: 401 });
	}

	if (!loggedInUser.attending && !loggedInUser.role) {
		return new Response("You have not been marked as attending the social. Please talk to a member of faculty to be able to book.", { status: 403 });
	}

	const { table: tableIdString } = await params;
	const tableId = Number(tableIdString);

	if (isNaN(tableId)) {
		return new Response("Invalid table ID format.", { status: 400 });
	}

	let targetUserId = session.user.id;
	const reqUserParam = request.nextUrl.searchParams.get("user");

	let userToBook = loggedInUser;

	if (reqUserParam) {
		if (!loggedInUser.role) {
			return new Response("You do not have permission to book for other users.", { status: 403 });
		}
		targetUserId = reqUserParam;
		const foundUserToBook = await db.query.user.findFirst({
			where: (s, { eq }) => (eq(s.id, targetUserId))
		});
		if (!foundUserToBook) {
			return new Response("Target user for booking not found.", { status: 404 });
		}
		userToBook = foundUserToBook;

		if (!userToBook.attending) {
			return new Response("The selected user has not been marked as attending. They cannot be booked.", { status: 403 });
		}
	}


	const targetTable = await db.query.table.findFirst({
		where: (t, { eq }) => (eq(t.id, tableId)),
		with: {
			users: {
				columns: {
					id: true,
					hasGuest: true,
				}
			}
		}
	});

	if (!targetTable) {
		return new Response("Table not found.", { status: 404 });
	}

	let currentOccupancy = 0;
	if (targetTable.users) {
		targetTable.users.forEach(user => {
			currentOccupancy += 1;
			if (user.hasGuest) {
				currentOccupancy += 1;
			}
		});
	}

	const spotsNeeded = userToBook.hasGuest ? 2 : 1;
	const remainingCapacity = TABLE_CAPACITY - currentOccupancy;

	let isAlreadyBookedAtThisTable = false;
	if (userToBook.tableId === tableId) {
		isAlreadyBookedAtThisTable = true;
	}


	if (!isAlreadyBookedAtThisTable && remainingCapacity < spotsNeeded) {
		return new Response(
			`This table does not have enough space. It has ${remainingCapacity} spot(s) available, but ${spotsNeeded} are needed due to your guest.`,
			{ status: 409 }
		);
	}

	try {
		await db.update(userSchema)
			.set({ tableId: tableId })
			.where(eq(userSchema.id, userToBook.id));

		return new Response(`Successfully booked table ${tableId}.`, { status: 200 });

	} catch (error) {
		console.error("Error during booking:", error);
		return new Response("An error occurred while trying to book the table.", { status: 500 });
	}
}
