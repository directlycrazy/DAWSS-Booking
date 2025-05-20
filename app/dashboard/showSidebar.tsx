"use client";

import { usePathname } from 'next/navigation'
import BookSidebar from "./(book)/book-sidebar";

export default function ShowSidebar() {
	const pathname = usePathname()

	return (
		<>
			{pathname.endsWith("/dashboard") && <BookSidebar />}
		</>
	)
}