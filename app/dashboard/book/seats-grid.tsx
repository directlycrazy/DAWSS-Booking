"use client";

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
import { Button } from "@/components/ui/button";
import Title, { Subtitle } from "@/components/title";
import { Separator } from "@/components/ui/separator";
import Table from './table';
import { XIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface UserType {
	id: string;
	name: string;
	email: string;
	role: boolean;
	seatId?: number;
	tableId?: number;
	attending: boolean;
	hasGuest: boolean;
}

export interface TableType {
	id: number;
	users: UserType[]
}

interface SeatsGridProps {
	currentUserId?: string;
	currentUserHasGuest: boolean;
	userId?: string;
	initialTableId?: number | null;
	currentUserTableId?: number | null;
	currentUserRole?: boolean;
}

const TABLE_CAPACITY = 10;

export default function SeatsGrid({ currentUserId, currentUserHasGuest, userId, initialTableId, currentUserTableId, currentUserRole }: SeatsGridProps) {
	const [tables, setTables] = useState<TableType[]>([]);
	const [selectedTable, setSelectedTable] = useState("");
	const [selectedTableInfo, setTableInfo] = useState<TableType | null>(null);
	const [myTable, setMyTable] = useState<string | number>(currentUserTableId || "");

	const [newBooking, setNewBooking] = useState(false);
	const [sidebarVisible, setSidebarVisible] = useState(false);

	const searchParams = useSearchParams();
	const tableParam = searchParams.get("table");

	const userBeingBooked = tables.flatMap(t => t.users).find(u => u.id === userId);

	const getSpotsNeededForBookingUser = () => {
		if (userId && userId !== currentUserId) {
			if (userBeingBooked) {
				return userBeingBooked.hasGuest ? 2 : 1;
			}
			return 1;
		}
		return currentUserHasGuest ? 2 : 1;
	};

	const calculateEffectiveOccupancy = (tableUsers: UserType[] | undefined): number => {
		if (!tableUsers) return 0;
		return tableUsers.reduce((acc, user) => acc + (user.hasGuest ? 2 : 1), 0);
	};

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

	//  Variables needed for the sidebar's guest logic 
	const spotsNeededByCurrentUser = getSpotsNeededForBookingUser();
	const currentSelectedTableOccupancy = selectedTableInfo?.users ? calculateEffectiveOccupancy(selectedTableInfo.users) : 0;
	const spotsAvailableOnSelectedTable = TABLE_CAPACITY - currentSelectedTableOccupancy;
	const myBookedTableIdAsNumber = typeof myTable === 'string' ? parseInt(myTable, 10) : myTable;
	const selectedTableInfoIdAsNumber = selectedTableInfo?.id ? Number(selectedTableInfo.id) : null;
	const canBookSelectedTable = selectedTableInfo && (spotsAvailableOnSelectedTable >= spotsNeededByCurrentUser);

	const renderTableUsersWithGuests = (users: UserType[] | undefined) => {
		if (!users) return null;
		const displayList: { name: string, isGuest: boolean, id: string }[] = [];
		users.forEach(user => {
			displayList.push({ name: user.name, isGuest: false, id: `user-${user.id}` });
			if (user.hasGuest) {
				displayList.push({ name: `${user.name}'s Guest`, isGuest: true, id: `guest-${user.id}` });
			}
		});
		return displayList.map((item) => (
			<li key={item.id} className={item.isGuest ? "italic text-muted-foreground ml-2" : ""}>
				{item.name}
			</li>
		));
	};

	return (
		<>
			<div className="lg:grid grid-cols-5"> {/* Main layout grid */}
				<div className="col-span-4 md:m-6">
					<div>
						<Title>Book Your Table</Title>
						<Subtitle>
							Click a table to view its members or to book your spot.
							{currentUserHasGuest && " You will be booking for yourself and one guest (2 spots total)."}
						</Subtitle>
					</div>
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
							<div className="m-4">
								<h1 className="text-center font-black invisible fixed md:visible md:static" style={{ writingMode: "vertical-rl" }}>Dance Floor & DJ</h1>
								<h1 className="text-center font-black visible static md:fixed md:invisible">Dance Floor & DJ</h1>
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
				</div>

				{/* Sidebar */}
				<div className={`min-h-svh border-l p-4 w-full col-span-1 fixed inset-y-0 right-0 lg:static overflow-y-auto bg-card z-20 lg:z-auto transform transition-transform duration-300 ease-in-out ${sidebarVisible ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}
				>
					{selectedTableInfo ? (
						<>
							<div className="flex justify-between items-center">
								<h1 className="font-bold text-xl">Table {selectedTableInfo.id} Overview</h1>
								<Button variant="ghost" size="icon" className="lg:hidden" onClick={() => {
									setSidebarVisible(false);
									setSelectedTable("");
									setTableInfo(null);
								}}>
									<XIcon className="h-5 w-5" />
								</Button>
							</div>
							<Separator className="my-2" />

							<p className="text-sm text-muted-foreground">
								Occupancy: {currentSelectedTableOccupancy} / {TABLE_CAPACITY}
							</p>

							{selectedTableInfo.users && selectedTableInfo.users.length > 0 ? (
								<>
									<h2 className="font-semibold mb-1 mt-3">Members at this table:</h2>
									<ul className="list-disc list-inside text-sm space-y-1">
										{renderTableUsersWithGuests(selectedTableInfo.users)}
									</ul>
								</>
							) : (
								<p className="text-muted-foreground text-sm mt-3">No one is currently booked at this table.</p>
							)}

							<div className="mt-4">
								<Button
									onClick={() => {
										if (selectedTableInfo && selectedTableInfo.id) {
											if (canBookSelectedTable) {
												setNewBooking(true);
											} else {
												toast.error(`Not enough spots. You need ${spotsNeededByCurrentUser}, but only ${spotsAvailableOnSelectedTable} are available.`);
											}
										} else {
											toast.error("Please select a valid table first.");
										}
									}}
									disabled={
										!selectedTableInfo ||
										(myBookedTableIdAsNumber === selectedTableInfoIdAsNumber) ||
										!canBookSelectedTable
									}
									className="w-full"
								>
									{myBookedTableIdAsNumber === selectedTableInfoIdAsNumber ? `You're Booked Here` : `Book Spot at Table ${selectedTableInfo.id}`}
								</Button>

								{selectedTableInfo && !canBookSelectedTable && myBookedTableIdAsNumber !== selectedTableInfoIdAsNumber && (
									<p className="text-destructive text-xs mt-1 font-bold">
										Not enough spots for you{currentUserHasGuest ? " and your guest" : ""}. (Needs: {spotsNeededByCurrentUser}, Available: {spotsAvailableOnSelectedTable})
									</p>
								)}
							</div>
						</>
					) : (
						<>
							<div className="flex justify-between items-center">
								<h1 className="font-bold text-xl">Table Overview</h1>
								<Button variant="ghost" size="icon" className="lg:hidden" onClick={() => {
									setSelectedTable("");
									setTableInfo(null);
								}}>
									<XIcon className="h-5 w-5" />
								</Button>
							</div>
							<p className="text-muted-foreground mt-2">Click on a table to see more details.</p>
						</>
					)}
				</div>
			</div>

			<AlertDialog open={newBooking} onOpenChange={setNewBooking}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Would you like to book this table?</AlertDialogTitle>
						<AlertDialogDescription>
							This action <b>can be undone</b>.
							{currentUserHasGuest ?
								` You are booking for yourself and one guest (${spotsNeededByCurrentUser} spots).` :
								" You are booking for yourself (1 spot)."
							}
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
