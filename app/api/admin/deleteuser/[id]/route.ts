import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { user as userSchema } from '@/drizzle/schema';
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth-server";

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const adminUser = await getUser(await headers());

    if (!adminUser || adminUser.role !== true) { // Assuming 'role' indicates admin status
        return NextResponse.json({ message: "You do not have permission to perform this action." }, { status: 403 });
    }

    const { id: userIdToDelete } = await params;
    if (!userIdToDelete) {
        return NextResponse.json({ message: "User ID parameter is missing." }, { status: 400 });
    }

    try {
        // Optional: Check if user exists before deleting if you want a specific "not found" message
        const existingUser = await db.query.user.findFirst({
            where: (s, { eq }) => eq(s.id, userIdToDelete)
        });

        if (!existingUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        await db.delete(userSchema).where(eq(userSchema.id, userIdToDelete));

        return NextResponse.json({ message: `User ${existingUser.name || userIdToDelete} deleted successfully.` }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Failed to delete user." }, { status: 500 });
    }
}