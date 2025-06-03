import { TicketCheck } from "lucide-react"
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import CreateAdmin from "./create-admin";
import { getOnboarding } from "@/lib/auth-server";
import { db } from "@/drizzle/db";
import { user as userSchema, account as accountSchema } from '@/drizzle/schema';
import { createRandomString } from "@/lib/utils";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
	title: "Onboarding"
};

export default async function OnboardingOne() {
	//If onboarding state is not active, prevent page access
	if (!(await getOnboarding())) return redirect("/");

	const CreateUser = async (email: string, password: string) => {
		"use server";

		console.log(`Admin user created with email ${email}.`)

		if (!(await getOnboarding())) return false;

		const userId = createRandomString(25);
		const time = new Date();

		await db.insert(userSchema).values({
			id: userId,
			email: email,
			name: "Grad Social Admin",
			emailVerified: true,
			role: true,
			createdAt: time,
			updatedAt: time
		});

		const ctx = await auth.$context;
		const hash = await ctx.password.hash(password);

		const accountId = createRandomString(25);

		await db.insert(accountSchema).values({
			id: accountId,
			accountId: userId,
			userId: userId,
			providerId: "credential",
			password: hash,
			createdAt: time,
			updatedAt: time
		});

		return true;
	}

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link href="/" className="flex items-center gap-2 font-medium">
						<div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<TicketCheck className="size-4" />
						</div>
						Wilson {new Date().getFullYear()} Grad Social
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full -mt-20">
						<div className="max-w-[500px] mx-auto">
							<CreateAdmin action={CreateUser} />
						</div>
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<Image
					src="/banner.jpg"
					width={1920}
					height={1080}
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	)
}
