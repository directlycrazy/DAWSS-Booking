import Title from "@/components/title";
import Link from "next/link";

export default function About() {
	return (
		<>
			<div>
				<Title>Wilson Grad Social {new Date().getFullYear()} Booker</Title>
				<div className="mt-4">
					<b>Created By:</b>
					<ul className="list-disc list-inside space-y-1">
						<li><Link href="https://jamescolb.com" className="underline">James Colbourne</Link></li>
						<li><Link href="https://github.com/KushParmar07" className="underline">Kush Parmar</Link></li>
						<li><Link href="https://github.com/Kirk-KD" className="underline">Kirk Ding</Link></li>
					</ul>
				</div>
			</div>
		</>
	)
}