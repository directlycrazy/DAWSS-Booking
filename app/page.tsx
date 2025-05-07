import SignIn from '@/components/sign-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Login() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (session) return redirect("/dashboard");

	return (
		<>
			<div className="flex justify-center items-center h-full">
				<Tabs defaultValue="email" className="w-[500px]">
					<TabsList>
						<TabsTrigger value="email">Using Email</TabsTrigger>
						<TabsTrigger value="oen">Using OEN Number</TabsTrigger>
					</TabsList>
					<TabsContent value="email">
						<SignIn />
					</TabsContent>
					<TabsContent value="oen">
						Not Implemented
						{/* <SignUp /> */}
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
}