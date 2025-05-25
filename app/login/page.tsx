import { TicketCheck } from "lucide-react"
import PasswordSignIn from '@/components/password-signin';
import SignIn from '@/components/sign-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login"
};

export default async function LoginPage() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (session) return redirect("/dashboard");

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
						<Tabs defaultValue="email" className="max-w-[500px] mx-auto">
							<TabsList>
								<TabsTrigger value="email">Student Login</TabsTrigger>
								<TabsTrigger value="pass">Staff Login</TabsTrigger>
							</TabsList>
							<TabsContent value="email">
								<SignIn />
							</TabsContent>
							<TabsContent value="pass">
								<PasswordSignIn />
							</TabsContent>
						</Tabs>
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
