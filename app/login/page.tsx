import SignIn from '@/components/sign-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Login() {
	return (
		<>
			<div className="flex justify-center w-full">
				<Tabs defaultValue="email" className="w-[500px]">
					<TabsList>
						<TabsTrigger value="email">Using Email</TabsTrigger>
						<TabsTrigger value="oen">Using OEN Number</TabsTrigger>
					</TabsList>
					<TabsContent value="email">
						<SignIn />
					</TabsContent>
					<TabsContent value="oen">
						{/* <SignUp /> */}
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
}