import { db } from '@/drizzle/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { Resend } from 'resend';
import { writeLog } from './log';

const sendEmail = async (data: { email: string, url: string }, index: number, key: string, template: string, text?: string) => {
	console.log(`Trying email ${index} <dawbooking@mail${index != 0 ? index : ""}.jamescolb.com>`)

	const resend = new Resend(key);

	const { error } = await resend.emails.send({
		from: `DAWSS Booking <dawbooking@mail${index != 0 ? index : ""}.jamescolb.com>`,
		to: [data.email],
		subject: "Login to your Donald A. Wilson Grad Social Booking Account",
		html: template,
		text: text || template,
	})

	if (error) return false;
	return true;
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite"
	}),
	plugins: [
		magicLink({
			disableSignUp: true,
			async sendMagicLink(data) {
				const user = await db.query.user.findFirst({
					where: (user, { eq }) => eq(user.email, data.email),
				})

				//User has to be in database to reach this point regardless.
				if (!user) return;

				const template = `<p>Hello ${user.name},</p>
					<p>We received a request to login to your Grad Social Booking account using this email address. If you want to sign in with your account, please click this link:</p>
					<a href="${data.url}">Sign in to your Grad Social Account</a>
					<p>If you did not request this, you can safely ignore this email or contact a member of staff.</p>
					<p>Thanks,</p>
					<p>Donald A. Wilson Grad Social Booking Team</p>
					`;

				const text = `Hello ${user.name},

					We received a request to login to your Grad Social Booking account using this email address. If you want to sign in with your account, please click this link:
					
					${data.url}
					
					If you did not request this, you can safely ignore this email or contact a member of staff.

					Thanks,
					Donald A. Wilson Grad Social Booking Team
					`

				await writeLog("Attempted to login.", user.name);

				let attempt = await sendEmail(data, 0, process.env.RESEND_KEY_1 || "", template, text);
				if (!attempt) attempt = await sendEmail(data, 2, process.env.RESEND_KEY_2 || "", template, text);
				if (!attempt) attempt = await sendEmail(data, 3, process.env.RESEND_KEY_3 || "", template, text);
			},
		}),
	],
	emailAndPassword: {
		enabled: true,
		disableSignUp: true
	},
	rateLimit: {
		enabled: false
	},
	baseURL: process.env.BETTER_AUTH_URL
});