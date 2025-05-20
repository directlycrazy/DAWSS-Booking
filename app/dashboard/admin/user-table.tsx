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
import { ArrowUpDown, MoreHorizontal, UploadCloud, Trash2, ShieldAlert, PlusCircle } from "lucide-react" // Added PlusCircle
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose, // Added DialogClose
} from "@/components/ui/dialog" // Added Dialog components
import { Label } from "@/components/ui/label" // Added Label for dialog inputs
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import Link from "next/link"
import * as XLSX from 'xlsx';

interface UserInt {
    id: string,
    name: string,
    email: string,
    role: boolean,
    tableId: string | null,
    attending: boolean
    hasGuest?: boolean
}

interface ExcelRow {
    Name?: string;
    Email?: string;
}

export default function UserTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({ id: false })
    const [rowSelection, setRowSelection] = React.useState({})
    const [data, setData] = React.useState<UserInt[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // State for confirmation dialogs
    const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
    const [showDeleteAllUsersDialog, setShowDeleteAllUsersDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserInt | null>(null);

    // State for Add User Dialog
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");


    const columns: ColumnDef<UserInt>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => <div><b>{row.getValue("name")}</b></div>,
        },
        { accessorKey: "id", header: "id", cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div> },
        { accessorKey: "email", header: "Email", cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div> },
        {
            accessorKey: "tableId",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3">Table Number <ArrowUpDown /></Button>
            ),
            cell: ({ row }) => {
                const tableId = row.original.tableId;
                return tableId ? <Link href={`/dashboard?table=${tableId}`} className="underline font-bold">{tableId}</Link> : <div>None</div>;
            },
        },
        {
            accessorKey: "attending",
            header: "Attending",
            cell: ({ row }) => (
                <Checkbox
                    defaultChecked={row.getValue("attending")}
                    onCheckedChange={async () => {
                        const req = await fetch(`/api/admin/attending/${row.getValue("id")}`);
                        if (req.ok) toast.success("Successfully changed.");
                        else toast.error("Failed to change attending status.");
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
                            const resJson = await req.json();
                            if (req.ok) toast.success(resJson.message || "Successfully updated guest status.");
                            else toast.error(`Failed to update guest status: ${resJson.message || req.statusText}`);
                        } catch {
                            toast.error("An error occurred while updating guest status.");
                        }
                    }}
                    aria-label="Toggle has guest status"
                />
            ),
        },
        {
            accessorKey: "booked",
            header: "Booked",
            cell: ({ row }) => <Checkbox checked={row.original.tableId !== null} aria-label="Select row" disabled />,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => user.tableId && redirect(`/dashboard?table=${user.tableId}`)}>Show Table</DropdownMenuItem>
                            <DropdownMenuItem onClick={async () => {
                                const res = await fetch(`/api/admin/removebooking/${user.id}`);
                                if (res.ok) {
                                    toast.success("Successfully removed booking.");
                                    getUsers();
                                } else {
                                    toast.error("Failed to remove booking.");
                                }
                            }}>Remove Selection</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => redirect(`/dashboard/admin/set/${user.id}`)}>Change Table</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    setUserToDelete(user);
                                    setShowDeleteUserDialog(true);
                                }}
                                className="text-red-600 hover:!text-red-700"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];


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
        try {
            const res = await fetch(`/api/admin/listusers`);
            if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Could not load user data.");
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    const handleExport = () => {
        const rowsToExport = table.getFilteredRowModel().rows.map(row => {
            const original = row.original as UserInt;
            return {
                "Name": original.name, "ID": original.id, "Email": original.email,
                "Table Number": original.tableId || "None", "Attending": original.attending ? "Yes" : "No",
                "Has Guest": original.hasGuest ? "Yes" : "No", "Booked": original.tableId !== null ? "Yes" : "No",
            };
        });
        if (rowsToExport.length === 0) { toast.error("No data to export."); return; }
        const worksheet = XLSX.utils.json_to_sheet(rowsToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        XLSX.writeFile(workbook, `User_Table_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
        toast.success("Data exported successfully!");
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const fileData = e.target?.result;
                if (!fileData) { toast.error("Could not read file data."); return; }
                const workbook = XLSX.read(fileData, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonRows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
                if (jsonRows.length === 0) { toast.info("Excel file is empty."); return; }
                toast.info(`Found ${jsonRows.length} users. Starting upload...`);
                let successCount = 0, failCount = 0, skippedCount = 0;
                for (const row of jsonRows) {
                    const name = row.Name, email = row.Email;
                    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
                        toast.warning(`Skipping row: missing or invalid Name/Email (${JSON.stringify(row)})`);
                        failCount++; continue;
                    }
                    try {
                        const response = await fetch(`/api/seed?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
                        if (response.ok || response.status === 201) successCount++;
                        else if (response.status === 409) skippedCount++;
                        else {
                            const errorResult = await response.json().catch(() => ({ message: response.statusText }));
                            toast.error(`Failed to process ${name} (${email}): ${errorResult.message || response.statusText}`);
                            failCount++;
                        }
                    } catch {
                        toast.error(`Client-side error processing ${name} (${email}).`);
                        failCount++;
                    }
                }
                let summaryMessage = "";
                if (successCount > 0) summaryMessage += `${successCount} new users added. `;
                if (skippedCount > 0) summaryMessage += `${skippedCount} existing users skipped. `;
                if (failCount > 0) summaryMessage += `${failCount} users failed to process.`;
                if (summaryMessage) {
                    if (failCount > 0) toast.warning(summaryMessage.trim() + " Check console.");
                    else toast.success(summaryMessage.trim() || "Processing complete.");
                } else if (jsonRows.length > 0) toast.info("No users processed (check data/console).");
                getUsers();
            } catch {
                toast.error("Failed to process Excel. Ensure 'Name' & 'Email' columns exist.");
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.onerror = () => { toast.error("Failed to read file."); if (fileInputRef.current) fileInputRef.current.value = ""; };
        reader.readAsBinaryString(file);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            const response = await fetch(`/api/admin/deleteuser/${userToDelete.id}`, { method: 'DELETE' });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || `User ${userToDelete.name} deleted.`);
                getUsers();
            } else toast.error(result.message || "Failed to delete user.");
        } catch {
            toast.error("Error deleting user.");
        }
        setShowDeleteUserDialog(false);
        setUserToDelete(null);
    };

    const confirmDeleteAllUsers = async () => {
        try {
            const response = await fetch(`/api/admin/deleteallusers`, { method: 'DELETE' });
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message || "All users deleted.");
                getUsers();
            } else toast.error(result.message || "Failed to delete all users.");
        } catch {
            toast.error("Error deleting all users.");
        }
        setShowDeleteAllUsersDialog(false);
    };

    const handleManualAddUser = async () => {
        if (!newUserName.trim() || !newUserEmail.trim()) {
            toast.error("Name and Email cannot be empty.");
            return;
        }
        // Basic email validation (optional, but good practice)
        if (!/\S+@\S+\.\S+/.test(newUserEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            const response = await fetch(`/api/seed?email=${encodeURIComponent(newUserEmail)}&name=${encodeURIComponent(newUserName)}`);
            const result = await response.json().catch(() => ({ message: response.statusText })); // Catch if response is not JSON

            if (response.ok || response.status === 201) {
                toast.success(result.message || `User ${newUserName} added successfully!`);
                getUsers();
                setShowAddUserDialog(false); // Close dialog on success
                setNewUserName(""); // Reset fields
                setNewUserEmail("");
            } else if (response.status === 409) {
                toast.warning(result.message || `User with email ${newUserEmail} already exists.`);
            } else {
                toast.error(result.message || `Failed to add user. Status: ${response.status}`);
            }
        } catch (error) {
            toast.error("An error occurred while adding the user.");
            console.error("Manual add user error:", error);
        }
    };


    return (
        <div className="w-full -mt-2">
            <div className="flex overflow-x-auto items-center py-4 gap-x-2">
                <Input
                    placeholder="Filter users..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="min-w-xs max-w-sm"
                />
                <div className="ml-auto flex items-center gap-2">
                    <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Student</DialogTitle>
                                <DialogDescription>
                                    Manually add a new student to the system. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="col-span-3"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newUserEmail}
                                        onChange={(e) => setNewUserEmail(e.target.value)}
                                        className="col-span-3"
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleManualAddUser}>Save User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Excel
                    </Button>
                    <input
                        type="file" ref={fileInputRef} onChange={handleFileUpload}
                        accept=".xlsx, .xls" style={{ display: 'none' }}
                    />
                    <Button variant="outline" onClick={handleExport}>
                        Download Excel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteAllUsersDialog(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete All Users
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>{table.getHeaderGroups().map(hg => (<TableRow key={hg.id}>{hg.headers.map(h => (<TableHead key={h.id}>{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>))}</TableRow>))}</TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
                </div>
            </div>

            {/* Delete User Confirmation Dialog */}
            <AlertDialog open={showDeleteUserDialog} onOpenChange={setShowDeleteUserDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user <strong>{userToDelete?.name}</strong> and all their associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
                            Yes, delete user
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete All Users Confirmation Dialog */}
            <AlertDialog open={showDeleteAllUsersDialog} onOpenChange={setShowDeleteAllUsersDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center"><ShieldAlert className="mr-2 h-6 w-6 text-red-500" />Confirm Deletion of All Users</AlertDialogTitle>
                        <AlertDialogDescription>
                            <strong>This is a highly destructive action and cannot be undone.</strong> This will permanently delete <strong>ALL</strong> users from the database.
                            Are you absolutely sure you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteAllUsers} className="bg-red-600 hover:bg-red-700">
                            Yes, delete ALL users
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}