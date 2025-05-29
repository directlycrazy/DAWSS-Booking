"use client";

import { hasGuestAtom, myTableAtom, newBookingAtom, SeatsGridProps, table, tableInfo, tablesAtom, tableSidebarState, TableType, UserType } from "@/app/dashboard/(book)/shared";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { calculateEffectiveOccupancy, getSpotsNeededForBookingUser, TABLE_CAPACITY } from "./shared";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function BookSidebar({ currentUserId, userId }: SeatsGridProps) {
	const tables = useAtomValue<TableType[]>(tablesAtom);
	const [sidebarVisible, setSidebarVisible] = useAtom(tableSidebarState);
	const [selectedTableInfo, setTableInfo] = useAtom(tableInfo);
	const setSelectedTable = useSetAtom(table);
	const myTable = useAtomValue(myTableAtom);
	const setNewBooking = useSetAtom(newBookingAtom);
	const currentUserHasGuest = useAtomValue(hasGuestAtom);

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


	const userBeingBooked = tables.flatMap(t => t.users).find(u => u.id === userId);

	//  Variables needed for the sidebar's guest logic 
	const spotsNeededByCurrentUser = getSpotsNeededForBookingUser(currentUserId, userId, userBeingBooked, currentUserHasGuest);
	const currentSelectedTableOccupancy = selectedTableInfo?.users ? calculateEffectiveOccupancy(selectedTableInfo.users) : 0;
	const spotsAvailableOnSelectedTable = TABLE_CAPACITY - currentSelectedTableOccupancy;
	const myBookedTableIdAsNumber = typeof myTable === 'string' ? parseInt(myTable, 10) : myTable;
	const selectedTableInfoIdAsNumber = selectedTableInfo?.id ? Number(selectedTableInfo.id) : null;
	const canBookSelectedTable = selectedTableInfo && (spotsAvailableOnSelectedTable >= spotsNeededByCurrentUser);

	return (
		<div className={`p-4 w-full md:max-w-[300px] fixed bg-sidebar inset-y-0 right-0 lg:static overflow-y-auto z-20 lg:z-auto transform transition-transform duration-300 ease-in-out ${sidebarVisible ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}
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
	)
}