"use client";

import React from "react";

export function Seat({ id, initialBooked, selectedSeat, existingModal, newModal }: { id?: string, initialBooked?: boolean, selectedSeat?: React.Dispatch<React.SetStateAction<string>>, existingModal?: React.Dispatch<React.SetStateAction<boolean>>, newModal?: React.Dispatch<React.SetStateAction<boolean>> }) {

	return (
		<span className={`rounded-xl ${(initialBooked || false) ? "bg-neutral-200 dark:bg-neutral-600" : "bg-primary"} min-w-6 min-h-6 aspect-square`} onClick={() => {
			if (!existingModal || !newModal || !selectedSeat || !id) return;

			if (initialBooked) {
				existingModal(true);
			} else {
				newModal(true);
			}

			selectedSeat(id);
		}}></span>
	)
}
