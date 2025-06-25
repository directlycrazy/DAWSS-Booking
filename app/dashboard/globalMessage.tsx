"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

export default function GlobalMessage() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && localStorage !== undefined) {
			setOpen(localStorage.getItem("noticeDismissed") === "true" ? false : true)
		}
	}, [])

	return (
		<>
			<AlertDialog open={open} onOpenChange={() => setOpen(!open)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Important Notice</AlertDialogTitle>
						<AlertDialogDescription>
							This website will no longer be accessible as of <b>Wednesday, June 26, 2025 at 11:59 PM EST.</b> Thank you for using the application this year.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => { localStorage.setItem("noticeDismissed", "true") }}>Dismiss</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}