import Title from "@/components/title";
import Link from "next/link";

export default function Venue() {
	return (
		<>
			<Title>Venue Info</Title>
			<p className="text-muted-foreground">Visit the <Link className="font-bold underline" href="https://sites.google.com/ddsb.ca/dawssgradsocial/home" target="_blank">Grade 12 Grad Social Google Site</Link> for more information.</p>
		</>
	)
}