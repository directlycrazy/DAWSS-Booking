import { db } from '@/drizzle/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite"
	}),
	plugins: [
		magicLink({
			async sendMagicLink(data) {
				await resend.emails.send({
					from: "DAWSS Booking <dawbooking@mail.jamescolb.com>",
					to: [data.email],
					subject: "Login to your Donald A. Wilson Prom Booking Account",
					html: `<p>Hello, Donald A. Wilson Student,</p>
					<p>
						<b>Click the following link to access your account:</b>
						<span><a href="${data.url}">${data.url}</a></span>
					</p>
					<p>If you have any issues accessing the application, please wait a few minutes and try again. If this does not work, please contact a member of the Donald A. Wilson faculty to help assist you.
					<p>
						<span>Thanks,</span>
						<span>Donald A. Wilson Prom Booking Team</span>
					</p>
					`
				})
			},
		}),

	],
	baseURL: process.env.BETTER_AUTH_URL
});