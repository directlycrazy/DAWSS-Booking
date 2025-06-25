"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function globalMessage() {
	return (
		<>
			<AlertDialog defaultOpen={localStorage.getItem("noticeDismissed") === "true" ? false : true}>
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