// Import necessary modules and schema
import { db } from "@/drizzle/db"; // Your Drizzle DB instance
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { user as userSchema } from '@/drizzle/schema'; // Your Drizzle user schema
import { getUser } from "@/lib/auth-server";

// GET handler to toggle the 'hasGuest' status for a user
export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
	const adminUser = await getUser(await headers());

	// Check if the admin user exists and has an admin role
	if (!adminUser) {
		return new Response("Admin user not found.", { status: 403 }); // 403 for Forbidden
	}
	if (!adminUser.role) { // Assuming 'role' is a boolean where true means admin
		return new Response("You do not have permission to perform this action.", { status: 403 });
	}

	// Get the target user's ID from the route parameters
	const { id: targetUserId } = await params;
	if (!targetUserId) {
		return new Response("User ID parameter is missing.", { status: 400 }); // 400 for Bad Request
	}

	// Fetch the user whose 'hasGuest' status needs to be updated
	const targetUser = await db.query.user.findFirst({
		where: (s, { eq }) => (eq(s.id, targetUserId))
	});

	// Check if the target user exists
	if (!targetUser) {
		return new Response("Target user not found.", { status: 404 }); // 404 for Not Found
	}

	// Toggle the 'hasGuest' status
	const newHasGuestStatus = !targetUser.hasGuest;

	try {
		// Update the user in the database
		await db.update(userSchema)
			.set({ hasGuest: newHasGuestStatus })
			.where(eq(userSchema.id, targetUserId));

		// Return a success response
		return new Response(JSON.stringify({ message: "Successfully updated 'hasGuest' status.", newStatus: newHasGuestStatus }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error updating 'hasGuest' status:", error);
		return new Response("Failed to update 'hasGuest' status.", { status: 500 }); // 500 for Internal Server Error
	}
}
