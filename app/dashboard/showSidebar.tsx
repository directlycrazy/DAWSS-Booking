"use client";

import { usePathname } from 'next/navigation'
import BookSidebar from "./(book)/book-sidebar";
import { SeatsGridProps } from './(book)/shared';

export default function ShowSidebar({ currentUserId, currentUserHasGuest, initialTableId, currentUserTableId, currentUserRole }: SeatsGridProps) {
	const pathname = usePathname()

	return (
		<>
			{(pathname.endsWith("/dashboard") || pathname.includes("/dashboard/admin/set")) && <BookSidebar currentUserId={currentUserId}
				currentUserHasGuest={currentUserHasGuest ?? false}
				initialTableId={initialTableId}
				currentUserTableId={currentUserTableId}
				currentUserRole={currentUserRole ?? false} />}
		</>
	)
}