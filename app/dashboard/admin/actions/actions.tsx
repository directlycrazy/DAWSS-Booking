"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Trash2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Title, { Subtitle } from "@/components/title";
import { useState } from "react";
import { toast } from "sonner";

export default function Actions() {
	const [showDeleteAllUsersDialog, setShowDeleteAllUsersDialog] = useState(false);
	const [showPurgeTablesDialog, setShowPurgeTablesDialog] = useState(false);

	const confirmDeleteAllUsers = async () => {
		try {
			const response = await fetch(`/api/admin/deleteallusers`, { method: 'DELETE' });
			const result = await response.json();
			if (response.ok) {
				toast.success(result.message || "All users deleted.");
			} else toast.error(result.message || "Failed to delete all users.");
		} catch {
			toast.error("Error deleting all users.");
		}
		setShowDeleteAllUsersDialog(false);
	};

	const confirmClearEmptyTables = async () => {
		try {
			const response = await fetch(`/api/admin/clearemptytables`, { method: 'DELETE' });
			const result = await response.json();
			if (response.ok) {
				toast.success(result.message || "All empty tables purged.");
			} else toast.error(result.message || "Failed to purge tables.");
		} catch {
			toast.error("Failed to purge tables.");
		}
		setShowPurgeTablesDialog(false);
	}

	return (
		<>
			<div>
				<Title>Actions</Title>
				<Subtitle>Click any of the buttons below to change features in the application. Each of these actions <b>are not reversible. Do not click any action more than once, until a notification is seen.</b></Subtitle>
			</div>
			<Separator className="my-4" />
			<div className="max-w-[800px] mt-2">
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-2 lg:gap-y-0 md:gap-x-2">
					<Card className="gap-0 w-full">
						<CardHeader className="text-sm text-muted-foreground">
							<h1 className="text-xl font-bold">Table Actions</h1>
						</CardHeader>
						<CardContent>
							<Button onClick={() => setShowPurgeTablesDialog(true)}>Purge Empty Tables</Button>
						</CardContent>
					</Card>
					<Card className="gap-0 w-full">
						<CardHeader className="text-sm text-muted-foreground">
							<h1 className="text-xl font-bold">User Actions</h1>
						</CardHeader>
						<CardContent>
							<Button
								variant="destructive"
								onClick={() => setShowDeleteAllUsersDialog(true)}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete All Users
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* purge empty tables */}
			<AlertDialog open={showPurgeTablesDialog} onOpenChange={setShowPurgeTablesDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center"><ShieldAlert className="mr-2 h-6 w-6 text-destructive" />Purge Empty Tables</AlertDialogTitle>
						<AlertDialogDescription>
							<strong>This is a highly destructive action and cannot be undone.</strong> This will permanently delete tables that do not have at least one person seated at them.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmClearEmptyTables} className="bg-destructive hover:bg-destructive/90">
							Yes, Clear Empty Tables
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* delete all users */}
			<AlertDialog open={showDeleteAllUsersDialog} onOpenChange={setShowDeleteAllUsersDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center"><ShieldAlert className="mr-2 h-6 w-6 text-destructive" />Confirm Deletion of All Users</AlertDialogTitle>
						<AlertDialogDescription>
							<strong>This is a highly destructive action and cannot be undone.</strong> This will permanently delete <strong>ALL</strong> non-admin users from the database.
							Are you absolutely sure you want to proceed?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDeleteAllUsers} className="bg-destructive hover:bg-destructive/90">
							Yes, Delete ALL Users
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}