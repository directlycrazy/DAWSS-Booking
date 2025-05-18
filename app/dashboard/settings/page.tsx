"use client";

import Title, { Subtitle } from "@/components/title";
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
		<div className="space-y-3">
			<div>
				<Title>Settings</Title>
				<Subtitle>Modify the app settings.</Subtitle>
			</div>
			<div>
				<h3 className="font-bold">Theme</h3>
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
			</div>
		</div>
	)
}