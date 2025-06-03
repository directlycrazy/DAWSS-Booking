"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function CreateAdmin({ action }: { action: (email: string, password: string) => Promise<boolean> }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Create an Admin Account</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Since this is your first time using the application, please create an admin account to change features with.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="example@ddsb.ca"
							autoComplete="off"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
						</div>
						<Input
							id="password"
							type="password"
							placeholder="password"
							autoComplete="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={loading}
						onClick={async () => {
							setLoading(true);
							const res = await action(email, password)
							if (res) redirect('/dashboard');
						}}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<p> Create </p>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}