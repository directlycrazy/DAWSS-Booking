"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOut() {
	const router = useRouter();

	return (
		<Button onClick={async () => {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push("/");
					},
				},
			});;
		}} variant="destructive" className="cursor-pointer">Sign Out</Button>
	)
}