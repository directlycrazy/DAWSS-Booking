import React from "react";

export default function Title({ children }: { children: React.ReactNode }) {
	return (
		<>
			<h1 className="text-2xl md:text-3xl font-bold">{children}</h1>
		</>
	)
}

export function Subtitle({ children }: { children: React.ReactNode }) {
	return (
		<p className="text-foreground-secondary mb-2">{children}</p>
	)
}