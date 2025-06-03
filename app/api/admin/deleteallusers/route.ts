import { db } from "@/drizzle/db";
import { headers } from "next/headers";
import { user as userSchema } from '@/drizzle/schema';
import { NextResponse } from "next/server";
import { eq, not } from "drizzle-orm";
import { getUser } from "@/lib/auth-server";

export const DELETE = async () => {
    const adminUser = await getUser(await headers());

    if (!adminUser || adminUser.role !== true) { // Assuming 'role' indicates admin status
        return NextResponse.json({ message: "You do not have permission to perform this action." }, { status: 403 });
    }

    try {
        await db.delete(userSchema).where(not(eq(userSchema.role, true))); // This deletes all records from the user table
        // Be very careful with this operation in a production environment.
        // You might want to add extra safeguards or logging.
        return NextResponse.json({ message: "All users have been deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting all users:", error);
        return NextResponse.json({ message: "Failed to delete all users." }, { status: 500 });
    }
}