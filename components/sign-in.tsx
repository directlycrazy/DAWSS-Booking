"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Login() {
	const [email, setEmail] = useState("");
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [loading, setLoading] = useState(false);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Student Login</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your DDSB student email below to login to your account.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" autoComplete="off" placeholder="s000000000@ddsbstudent.ca" required onChange={(e) => { setEmail(e.target.value); }} value={email} />
						<Button disabled={loading || buttonDisabled} className="gap-2" onClick={async () => {
							if (!email) {
								return toast.error("Please enter an email.");
							}
							if (!email.endsWith("@ddsbstudent.ca") && !email.endsWith("@ddsb.ca")) {
								return toast.error("Please enter a valid email ending in @ddsb.ca or @ddsbstudent.ca.");
							}
							await signIn.magicLink({ email, callbackURL: "/dashboard" }, {
								onRequest: () => {
									setButtonDisabled(true);
									setLoading(true);
								},
								onResponse: () => {
									setLoading(false);
									toast.success("An email has been sent to your inbox.");

									setTimeRemaining(59);
									setInterval(() => {
										setTimeRemaining(a => a - 1);
									}, 1000)

									setTimeout(() => {
										setButtonDisabled(false);
									}, 59 * 1000)
								},
								onError: (ctx) => {
									toast.error(ctx.error.message);
								}
							});
						}}>
							{loading ? (<Loader2 size={16} className="animate-spin" />) : buttonDisabled ? <>Try Again in {timeRemaining} Seconds</> : <>Sign-in with Magic Link</>}
						</Button>
					</div>
				</div>
			</CardContent>
			<CardFooter className="text-muted-foreground text-sm">
				Please sign in using your regular computer login followed by @ddsb.ca (staff) or @ddsbstudent.ca (students).
			</CardFooter>
		</Card>
	);
}