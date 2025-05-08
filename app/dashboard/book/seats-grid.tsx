"use client";

import { Card } from "@/components/ui/card";
import { Seat } from "./seat";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import Loader from "@/components/loader";

export default function SeatsGrid() {
	const [tables, setTables] = useState<{
		id: number;
		seats: {
			id: number;
			userId: string | null;
			tableId: number | null;
		}[];
	}[]>([]);
	const [selectedSeat, setSelectedSeat] = useState("");
	const [selectedSeatInfo, setSeatInfo] = useState({ user: { name: "" } });
	const [existingBooking, setExistingBooking] = useState(false);
	const [newBooking, setNewBooking] = useState(false);

	const bookSpot = async () => {
		const res = await fetch(`/api/book/${selectedSeat}`);
		const text = await res.text();
		toast.info(text);
		getNewTables();
	}

	const getSeatInfo = async () => {
		const res = await fetch(`/api/seatinfo/${selectedSeat}`);
		const json = await res.json();
		setSeatInfo(json);
		getNewTables();
	}

	const getNewTables = async () => {
		const res = await fetch(`/api/listseats`);
		const json = await res.json();
		setTables(json);
	}

	useEffect(() => {
		if (existingBooking === true) getSeatInfo();
	}, [existingBooking])

	useEffect(() => {
		const tableInterval = setInterval(getNewTables, 2 * 60 * 1000);

		getNewTables();

		return () => {
			clearInterval(tableInterval);
		}
	}, []);

	return (
		<>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-2">
				{!tables.length && <Loader />}
				{tables.map((table, i) => {
					return (
						<Card className="p-4" key={i}>
							<div className="grid grid-cols-4 gap-y-2 gap-x-2">
								{table.seats.map((seat, i) => {
									return (
										<Seat id={String(seat.id)} initialBooked={seat.userId !== null && seat.userId.length > 0} selectedSeat={setSelectedSeat} key={i} existingModal={setExistingBooking} newModal={setNewBooking} />
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
							<b>{selectedSeatInfo.user?.name || "..."}</b> is the current holder of this spot.
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
							This action <b>can be undone</b>. <b>If you already have a booking, it will be replaced with this one.</b> Donald A. Wilson faculty have the right to change any arrangements as they see fit.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={bookSpot}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}