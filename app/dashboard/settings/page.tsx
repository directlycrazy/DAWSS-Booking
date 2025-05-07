"use client";

import Title from "@/components/title";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Settings() {
	const { theme, setTheme } = useTheme();

	const changeTheme = (e: string) => {
		setTheme(e);
	}

	return (
		<>
			<Title>Settings</Title>
			<div className="-mb-3">
				<h3 className="font-bold">Color Mode</h3>
			</div>
			<Select onValueChange={changeTheme} value={theme}>
				<SelectTrigger className="w-[180px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="system">System (Default)</SelectItem>
					<SelectItem value="light">Light</SelectItem>
					<SelectItem value="dark">Dark</SelectItem>
				</SelectContent>
			</Select>
			<Separator />
			<Link href="https://jamescolb.com" className="hover:underline font-bold" target="_blank">&copy; James Colbourne 2025</Link>
			<p className="-mt-4"><Link className="hover:underline" href="mailto:contact@jamescolb.com">Contact Me</Link> | <Link className="hover:underline" href="mailto:security@jamescolb.com">Responsible Security Disclosure</Link></p>
		</>
	)
}