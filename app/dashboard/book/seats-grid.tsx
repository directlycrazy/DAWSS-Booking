"use client";

import { Card } from "@/components/ui/card";
import { Seat } from "./seat";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SeatsGrid() {
	const [selectedSeat, setSelectedSeat] = useState("");
	const [existingBooking, setExistingBooking] = useState(false);
	const [newBooking, setNewBooking] = useState(false);

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-2">
				{Array.from({ length: 8 }, (_, i) => {
					return (
						<Card className="p-4" key={i}>
							<div className="grid grid-cols-4 gap-y-2 gap-x-2">
								{Array.from({ length: 8 }, (_, i) => {
									const booked = Math.floor(Math.random() * 2) === 1;
									return (
										<Seat id={String(Math.floor(Math.random() * 20000))} initialBooked={booked} selectedSeat={setSelectedSeat} key={i} existingModal={setExistingBooking} newModal={setNewBooking} />
									)
								})}
							</div>
							<p className="text-center text-sm text-muted-foreground">Table {i + 1}</p>
						</Card>
					)
				})}
			</div>
			<AlertDialog open={existingBooking} onOpenChange={setExistingBooking}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>This spot is already booked.</AlertDialogTitle>
						<AlertDialogDescription>
							<b>Name</b> is the current holder of this spot.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Dismiss</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<AlertDialog open={newBooking} onOpenChange={setNewBooking}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Would you like to book this spot?</AlertDialogTitle>
						<AlertDialogDescription>
							This action <b>can be undone</b>. Donald A. Wilson faculty have the right to change any arrangements as they see fit.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

		</>
	)
}