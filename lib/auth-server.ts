import { db } from "@/drizzle/db"
import { count } from "drizzle-orm"
import { user as userSchema } from '@/drizzle/schema';
import { auth } from "./auth";

export const getSession = async (headers: Headers) => {
	const session = await auth.api.getSession({
		headers: headers
	})

	if (!session?.user.id) return null;

	return session;
}

export const getUser = async (headers: Headers) => {
	//Also checking onboard may be redundant since user won't exist anyway
	const session = await getSession(headers);

	if (!session) return null;

	const userData = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, session.user.id),
		columns: {
			id: true,
			name: true,
			email: true,
			role: true,
			attending: true,
			hasGuest: true,
			tableId: true
		}
	})

	if (!userData || !userData.id) return null;

	return userData;
}

export const getOnboarding = async () => {
	const existingUsers = await db.select({ count: count() }).from(userSchema);
	console.log(existingUsers[0].count)
	if (existingUsers[0].count !== 0) return false;
	return true;
}