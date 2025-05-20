import { db } from "@/drizzle/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { user as userSchema } from '@/drizzle/schema';
import { NextRequest, NextResponse } from "next/server";
import { eq, not } from "drizzle-orm";

export const DELETE = async (request: NextRequest) => {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) {
        return NextResponse.json({ message: "You are not signed in." }, { status: 401 });
    }

    const adminUser = await db.query.user.findFirst({
        where: (s, { eq }) => eq(s.id, session.user.id),
    });

    if (!adminUser || !adminUser.role) { // Assuming 'role' indicates admin status
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