"use client";

export default function LocalizeTime({ date }: { date: Date | null }) {
	return (
		<>{date ? date.toLocaleString() : "Unknown"}</>
	)
}