"use client";

import { Seat } from "./seat";
import { useEffect } from "react";
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
import Title, { Subtitle } from "@/components/title";
import { Separator } from "@/components/ui/separator";
import Table from './table';
import { useSearchParams } from "next/navigation";
import { calculateEffectiveOccupancy, getSpotsNeededForBookingUser, hasGuestAtom, myTableAtom, newBookingAtom, table, TABLE_CAPACITY, tableInfo, tablesAtom, tableSidebarState } from "@/app/dashboard/(book)/shared";
import { useAtom, useSetAtom } from "jotai";
import { TableType, SeatsGridProps } from "@/app/dashboard/(book)/shared";

export default function SeatsGrid({ currentUserId, currentUserHasGuest, userId, initialTableId, currentUserTableId, currentUserRole, showTitle }: SeatsGridProps) {
	const [tables, setTables] = useAtom<TableType[]>(tablesAtom);
	const [selectedTable, setSelectedTable] = useAtom(table);
	const setTableInfo = useSetAtom(tableInfo);
	const [myTable, setMyTable] = useAtom(myTableAtom);
	const setCurrentUserHasGuest = useSetAtom(hasGuestAtom);

	const [newBooking, setNewBooking] = useAtom(newBookingAtom);
	const setSidebarVisible = useSetAtom(tableSidebarState);

	const searchParams = useSearchParams();
	const tableParam = searchParams.get("table");

	const userBeingBooked = tables.flatMap(t => t.users).find(u => u.id === userId);

	const spotsNeededByCurrentUser = getSpotsNeededForBookingUser(currentUserId, userId, userBeingBooked, currentUserHasGuest);

	const bookSpot = async (overwrite: boolean) => {
		if (overwrite && userId) {
			await fetch(`/api/admin/removebooking/${userId}`);
			toast.info("Successfully overwritten.");
		}
		if (!selectedTable) {
			toast.error("No table selected.");
			setNewBooking(false);
			return;
		}
		const res = await fetch(`/api/book/${selectedTable}${userId ? `?user=${userId}` : ""}`);
		const text = await res.text();

		if (res.ok) {
			toast.success(text || "Successfully booked.");
			getNewTables();
			setTable(selectedTable);
			setMyTable(selectedTable);
		} else {
			toast.error(text || "Booking failed.");
		}
		setNewBooking(false);
	};

	const getNewTables = async () => {
		const res = await fetch(`/api/listtables`);
		if (!res.ok) {
			toast.error("Failed to load tables.");
			return;
		}
		const json: TableType[] = await res.json();
		setTables(json);
	};

	useEffect(() => {
		const tableInterval = setInterval(getNewTables, 2 * 60 * 1000);

		if (initialTableId) setMyTable(String(initialTableId));
		if (currentUserHasGuest) {
			setCurrentUserHasGuest(true);
		} else {
			setCurrentUserHasGuest(false);
		}

		getNewTables();

		if (tableParam) { // `book?table=x` takes priority
			setTable(tableParam);
		} else if (myTable) {
			setTable(myTable.toString());
		} else if (initialTableId) {
			setTable(String(initialTableId));
		}

		return () => {
			clearInterval(tableInterval);
		}
	}, []);

	const setTable = async (id: string | number) => {
		const idStr = id.toString();
		setSelectedTable(idStr);
		if (!idStr) {
			setTableInfo(null);
			return;
		}
		try {
			const res = await fetch(`/api/tableinfo/${idStr}`);
			if (!res.ok) {
				toast.error(`Failed to load info for table ${idStr}.`);
				setTableInfo(null);
				return;
			}
			const tableData: TableType = await res.json();
			setTableInfo(tableData);
		} catch (error) {
			console.error("Error in setTable:", error);
			setTableInfo(null);
		}
	};

	const handleTableClick = async (table: TableType) => {
		const currentSimpleOccupancy = table.users ? table.users.length : 0;
		if (currentSimpleOccupancy >= 10 && table.id !== currentUserTableId && !currentUserRole) {
			toast.info(`Table ${table.id} is full and cannot be selected for booking directly.`);
			return;
		}

		setSidebarVisible(true);

		try {
			setTable(table.id.toString());
		}
		catch (error) {
			console.error("Error fetching table info:", error);
			setTableInfo(null);
		}
	};

	return (
		<>
			{showTitle && <div>
				<Title>Book Your Table</Title>
				<Subtitle>
					Click a table to view its members or to book your spot.
					{currentUserHasGuest && " You will be booking for yourself and one guest (2 spots total)."}
				</Subtitle>
			</div>}
			<Separator className="my-4" />
			<div className="md:flex gap-x-2">
				{!tables.length && <Loader />}
				{tables.length > 0 && <>
					<div className="grid grid-cols-5 gap-x-2 gap-y-2 w-full">
						{tables.slice(0, 25).map((table: TableType, i) => {
							const effectiveOccupancy = calculateEffectiveOccupancy(table.users);
							const isFull = effectiveOccupancy >= TABLE_CAPACITY;
							let tableColor: "default" | "full" | "selected" | "booked" = "default";
							if (selectedTable === table.id.toString()) {
								tableColor = "selected";
							} else if (myTable.toString() === table.id.toString()) {
								tableColor = "booked";
							} else if (isFull) {
								tableColor = "full";
							}
							return (
								<Table key={i} color={tableColor} table={table} click={handleTableClick} />
							)
						})}
					</div>
					<div className="p-4 outline rounded-lg flex my-2 md:my-0">
						<h1 className="text-center font-black invisible fixed md:visible md:static justify-center text-2xl tracking-tight" style={{ writingMode: "vertical-rl" }}>Dance Floor</h1>
						<h1 className="text-center font-black visible static md:fixed md:invisible tracking-tight">Dance Floor</h1>
					</div>
					<div className="grid grid-cols-5 gap-x-2 gap-y-2 w-full">
						{tables.slice(25, 100).map((table: TableType, i) => {
							const effectiveOccupancy = calculateEffectiveOccupancy(table.users);
							const isFull = effectiveOccupancy >= TABLE_CAPACITY;
							let tableColor: "default" | "full" | "selected" | "booked" = "default";
							if (selectedTable === table.id.toString()) {
								tableColor = "selected";
							} else if (myTable.toString() === table.id.toString()) {
								tableColor = "booked";
							} else if (isFull) {
								tableColor = "full";
							}
							return (
								<Table key={i} color={tableColor} table={table} click={handleTableClick} />
							)
						})}
					</div>
				</>}
			</div>
			<Separator className="my-5" />
			<div className="space-y-2">
				<p className="text-muted-foreground">Legend</p>
				<p className="items-center flex gap-x-2 text-sm text-muted-foreground"><Seat initialBooked={false} /> <span>indicates an <b>available table</b>.</span></p>
				<p className="items-center flex gap-x-2 text-sm text-muted-foreground"><Seat initialBooked={true} /> <span>indicates a <b>full table</b> (or your booked one).</span></p>
			</div>

			<AlertDialog open={newBooking} onOpenChange={setNewBooking}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Would you like to book this table?</AlertDialogTitle>
						<AlertDialogDescription>
							<b>
								{currentUserHasGuest ?
									` You are booking for yourself and one guest (${spotsNeededByCurrentUser} spots).` :
									" You are booking for yourself (1 spot)."
								}</b>
							{(typeof myTable === 'string' && myTable !== "" && myTable !== selectedTable) || (typeof myTable === 'number' && myTable !== 0 && myTable !== Number(selectedTable)) ?
								" Your previous booking will be replaced with this one. " :
								" "
							}
							Donald A. Wilson faculty have the right to change any arrangements as they see fit.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => bookSpot(false)}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
