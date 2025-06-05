import { log as logSchema } from '@/drizzle/schema';
import { createRandomString } from './utils';
import { db } from '@/drizzle/db';

export const writeLog = async (message: string, initiator: string) => {
	await db.insert(logSchema).values({
		id: createRandomString(25),
		message: message,
		initiator: initiator,
		createdAt: new Date()
	})
}