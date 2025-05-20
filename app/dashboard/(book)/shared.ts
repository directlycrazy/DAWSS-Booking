import { atom } from 'jotai';

export const TABLE_CAPACITY = 10;

export interface UserType {
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

export interface SeatsGridProps {
	currentUserId?: string;
	currentUserHasGuest: boolean;
	userId?: string;
	initialTableId?: number | null;
	currentUserTableId?: number | null;
	currentUserRole?: boolean;
}

export const calculateEffectiveOccupancy = (tableUsers: UserType[] | undefined): number => {
	if (!tableUsers) return 0;
	return tableUsers.reduce((acc, user) => acc + (user.hasGuest ? 2 : 1), 0);
};

export const getSpotsNeededForBookingUser = (currentUserId, userId, userBeingBooked, currentUserHasGuest) => {
	if (userId && userId !== currentUserId) {
		if (userBeingBooked) {
			return userBeingBooked.hasGuest ? 2 : 1;
		}
		return 1;
	}
	return currentUserHasGuest ? 2 : 1;
};

export const table = atom("");
export const tableInfo = atom<TableType | null>(null);
export const tableSidebarState = atom(false);
export const myTableAtom = atom("");
export const newBookingAtom = atom(false);