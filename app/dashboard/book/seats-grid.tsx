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

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
	SheetFooter,
} from "@/components/ui/sheet"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar"

import { toast } from "sonner";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import Title, { Subtitle } from "@/components/title";
import { Separator } from "@/components/ui/separator";
import Table from './table';

interface UserType {
	id: string;
	name: string;
	email: string;
	role: boolean;
	seatId?: number;
	tableId?: number;
	attending: boolean;
}

interface TableType {
	id: number;
	users: UserType[]
}

interface TableDisplayType {
	id: number;
	users?: UserType[]
}

type TableInfoType = any;

export default function SeatsGrid(
	{
		currentUserId, userId, initialTableData, currentUserTableId
	}: {
		currentUserId?: string;
		userId?: string;
		initialTableData?: TableType | null;
		currentUserTableId?: number | null;
	}) {
	const [tables, setTables] = useState<TableType[]>([]);
	const [selectedTable, setSelectedTable] = useState("");
	const [selectedTableInfo, setTableInfo] = useState<TableInfoType | null>(null);
	const [myTable, setMyTable] = useState(currentUserTableId || "");

	const [existingBooking, setExistingBooking] = useState(false);
	const [newBooking, setNewBooking] = useState(false);
	const [clickedTableDetails, setClickedTableDetails] = useState<TableType | null>(null);
	const [sidebarVisible, setSidebarVisible] = useState(false);

	const bookSpot = async (overwrite: boolean) => {
		if (overwrite && userId) {
			await fetch(`/api/admin/removebooking/${userId}`);
			toast.info("Successfully overwritten.");
		}
		const res = await fetch(`/api/book/${selectedTable}${userId ? `?user=${userId}` : ""}`);
		const text = await res.text();
		toast.info(text);
		getNewTables();
		setTable(selectedTable);
		//Mark table as booked by the user
		setMyTable(selectedTable);
	}

	const getNewTables = async () => {
		const res = await fetch(`/api/listtables`);
		const json = await res.json();
		setTables(json);
	}

	useEffect(() => {
		// if (existingBooking === true) getSeatInfo();
	}, [existingBooking])

	useEffect(() => {
		const tableInterval = setInterval(getNewTables, 2 * 60 * 1000);

		getNewTables();

		if (myTable) {
			setTable(myTable);
		}

		return () => {
			clearInterval(tableInterval);
		}
	}, []);

	const setTable = async (id: string) => {
		setSelectedTable(id);
		const res = await fetch(`/api/tableinfo/${id}`);
		const tableData: TableInfoType = await res.json();
		setTableInfo(tableData);
		handleSheetOpenChange(true);
	}

	const handleTableClick = async (table: TableType) => {
		try {
			if (selectedTable === table.id) {
				setTable(myTable);
			} else {
				setTable(table.id);
			}
		}
		catch (error) {
			console.error("Error fetching table info:", error);
			handleSheetOpenChange(false);
		}
	}

	const handleSheetOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			setSidebarVisible(false);
			// } else if (selectedTableInfo.users?.length < 10) {
		} else {
			setSidebarVisible(true);
		}
	}

	console.log(currentUserId)

	return (
		<>
			<div className="lg:grid grid-cols-12 h-svh">
				<div className="col-span-10 m-4">
					<div>
						<Title>Book Your Table</Title>
						<Subtitle>Click anywhere on the grid to book a spot or see who has already booked it.</Subtitle>
					</div>
					<Separator className="my-4" />
					<div className="md:flex gap-x-2">
						{!tables.length && <Loader />}
						{tables.length > 0 && <>
							<div className="grid grid-cols-6 gap-x-2 gap-y-2 w-full">
								{tables.slice(0, 25).map((table: TableType, i) => {
									return (
										<Table key={i} color={Number(selectedTable) === table.id ? "selected" : (table.users.length >= 10 ? "full" : (table.id === Number(myTable) ? "booked" : "default"))} table={table} click={handleTableClick} />
									)
								})}
							</div>
							<div className="md:w-[5px] m-4 md:break-all">
								<h1 className="text-center font-black leading-5">Dance Floor & DJ</h1>
							</div>
							<div className="grid grid-cols-6 gap-x-2 gap-y-2 w-full">
								{tables.slice(25, 100).map((table: TableType, i) => {
									console.log(selectedTable, table.id)
									return (
										<Table key={i} color={Number(selectedTable) === table.id ? "selected" : (table.users.length >= 10 ? "full" : (table.id === Number(myTable) ? "booked" : "default"))} table={table} click={handleTableClick} />
									)
								})}
							</div>
						</>}
					</div>
					<Separator className="my-5" />
					<div className="space-y-2">
						<p className="text-muted-foreground">Legend</p>
						<p className="items-center flex gap-x-2 text-sm text-muted-foreground"><Seat initialBooked={false} /> <span>indicates an <b>available table</b>.</span></p>
						<p className="items-center flex gap-x-2 text-sm text-muted-foreground"><Seat initialBooked={true} /> <span>indicates a <b>full table</b>.</span></p>
					</div>
				</div>
				{/* Sidebar */}
				<div className="border-l p-4 w-full col-span-2 fixed invisible md:static md:visible">
					{selectedTableInfo ? (
						<>
							<h1 className="font-bold text-xl">Table {selectedTableInfo.id} Overview</h1>
							<Separator className="my-2" />
							{selectedTableInfo.users && selectedTableInfo.users.length > 0 ? (
								<>
									<h2 className="font-semibold mb-1">Students at this table:</h2>
									<ul className="list-disc list-inside text-sm space-y-1">
										{selectedTableInfo.users.map((user: UserType, i) => (
											<li key={i}>{user.name}</li>
										))}
									</ul>
								</>
							) : (
								<p className="text-muted-foreground text-sm">No students currently at this table.</p>
							)}
							<div className="mt-4">
								<Button
									onClick={() => {
										if (selectedTableInfo.id) {
											setSelectedTable(selectedTableInfo.id.toString());
											setNewBooking(true);
										} else {
											toast.error("Please select a valid table first.");
										}
									}}
									disabled={!selectedTableInfo || (selectedTableInfo.users && selectedTableInfo.users.length >= 10) || (Number(myTable) === selectedTableInfo.id)}
								>
									{Number(myTable) === selectedTableInfo.id ? `You're Already Booked Here.` : `Book Spot at Table ${selectedTableInfo.id}`}
								</Button>
								{selectedTableInfo.users && selectedTableInfo.users.length >= 10 && (
									<p className="text-destructive text-xs mt-1 font-bold">This table is full.</p>
								)}
							</div>
						</>
					) : (
						<>
							<h1 className="font-bold text-xl">Table Overview</h1>
							<p className="text-muted-foreground">Click on a table to see more details.</p>
						</>
					)}
				</div>
			</div>
			<AlertDialog open={newBooking} onOpenChange={setNewBooking}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Would you like to book this table?</AlertDialogTitle>
						<AlertDialogDescription>
							This action <b>can be undone</b>. <b>If you already have a booking, it will be replaced with this one.</b> Donald A. Wilson faculty have the right to change any arrangements as they see fit.
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