import { TableType } from "./shared";

export default function Table({ table, color, click }: { table: TableType, color: "default" | "full" | "selected" | "booked" | string, click: (table: TableType) => void }) {
	return (
		<div className={`flex flex-col text-shadow-md items-center text-lg xl:text-4xl transition justify-center p-4 bg-primary text-white cursor-pointer text-center font-black rounded-xl aspect-square hover:bg-primary/80 ${color === "selected" && "!bg-primary/50 dark:!bg-primary/60 outline-2 outline-offset-2"} ${color === "full" && "!bg-neutral-500 dark:!bg-neutral-600"} ${color === "booked" && "!bg-neutral-400 dark:!bg-neutral-400"}`} onClick={() => click(table)}>
			{table.id}
		</div>
	)
}
