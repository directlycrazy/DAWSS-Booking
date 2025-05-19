"use client"

import * as React from "react"
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useEffect } from "react"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import Link from "next/link"

interface UserInt {
	id: string,
	name: string,
	email: string,
	role: boolean,
	tableId: string | null,
	attending: boolean
	hasGuest?: boolean
}

export const columns: ColumnDef<UserInt>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown />
				</Button>
			)
		},
		cell: ({ row }) => <div><b>{row.getValue("name")}</b></div>,
	},
	{
		accessorKey: "id",
		header: "id",
		cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
	},
	{
		accessorKey: "tableId",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="-ml-3"
				>
					Table Number
					<ArrowUpDown />
				</Button>
			)
		},
		cell: ({ row }) => {
			const tableId = row.original.tableId
			return tableId ? <Link href={`/dashboard/book?table=${tableId}`} className="underline font-bold">{tableId}</Link> : <div>None</div>
		},
	},
	{
		accessorKey: "attending",
		header: "Attending",
		cell: ({ row }) => (
			<Checkbox
				defaultChecked={row.getValue("attending")}
				onCheckedChange={async (value) => {
					const req = await fetch(`/api/admin/attending/${row.getValue("id")}`)
					if (req.ok || req.status === 200) toast.success("Successfully changed.")
					row.toggleSelected(!value)
				}}
				aria-label="Select row"
			/>
		),
	},
	{
		accessorKey: "hasGuest",
		header: "Has Guest",
		cell: ({ row }) => (
			<Checkbox
				defaultChecked={row.original.hasGuest || false} 
				onCheckedChange={async () => { 
					try {
						const req = await fetch(`/api/admin/hasguest/${row.original.id}`);
						if (req.ok) {
							const resJson = await req.json();
							toast.success(resJson.message || "Successfully updated guest status.");
						} else {
							const errorText = await req.text();
							toast.error(`Failed to update guest status: ${errorText}`);
						}
					} catch (error) {
						toast.error("An error occurred while updating guest status.");
						console.error(error);
					}
				}}
				aria-label="Toggle has guest status"
			/>
		),
	},
	{
		accessorKey: "booked",
		header: "Booked",
		cell: ({ row }) => (
			<Checkbox
				checked={row.original.tableId !== null}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => {
							if (row.original.tableId) redirect(`/dashboard/book?table=${row.original.tableId}`);
						}}>
							Show Table
						</DropdownMenuItem>
						<DropdownMenuItem onClick={async () => {
							const res = await fetch(`/api/admin/removebooking/${row.original.id}`);
							if (res.ok && res.status === 200) {
								toast.success("Successfully removed booking.");
								window.location.reload();
							}
						}}>Remove Selection</DropdownMenuItem>
						<DropdownMenuItem onClick={() => redirect(`/dashboard/admin/set/${row.original.id}`)}>Change Table</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]

export default function UserTable() {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({ id: false })
	const [rowSelection, setRowSelection] = React.useState({})
	const [data, setData] = React.useState([]);

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 15
			}
		}
	})

	const getUsers = async () => {
		const res = await fetch(`/api/admin/listusers`);
		const json = await res.json();
		setData(json);
	}

	useEffect(() => {
		getUsers();
	}, [])

	return (
		<div className="w-full -mt-2">
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter users..."
					value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("name")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
