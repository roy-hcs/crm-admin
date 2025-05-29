import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Sample data for basic table
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
];

// Sample data for data table
type SalesData = {
  id: string;
  product: string;
  quantity: number;
  amount: number;
  status: "completed" | "pending" | "canceled";
  date: string;
};

const salesData: SalesData[] = [
  {
    id: "1",
    product: "Product A",
    quantity: 5,
    amount: 500,
    status: "completed",
    date: "2023-05-10",
  },
  {
    id: "2",
    product: "Product B",
    quantity: 3,
    amount: 300,
    status: "pending",
    date: "2023-05-11",
  },
  {
    id: "3",
    product: "Product C",
    quantity: 2,
    amount: 200,
    status: "completed",
    date: "2023-05-12",
  },
  {
    id: "4",
    product: "Product D",
    quantity: 7,
    amount: 700,
    status: "canceled",
    date: "2023-05-13",
  },
  {
    id: "5",
    product: "Product E",
    quantity: 4,
    amount: 400,
    status: "pending",
    date: "2023-05-14",
  },
];

// Column definitions for data table
const columns: ColumnDef<SalesData>[] = [
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-right">${row.getValue("amount")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`
          inline-block px-2 py-1 rounded-full text-xs font-medium
          ${status === "completed" ? "bg-green-100 text-green-800" : 
            status === "pending" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"}
        `}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];

export const SalesReportPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Configure the data table
  const table = useReactTable({
    data: salesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="flex flex-col p-8 gap-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold">Sales Report Page</h1>
        <p className="mb-8 text-lg text-gray-700">This is the sales report page.</p>
      </div>

      {/* Basic Table Example */}
      <div className="rounded-md border">
        <h2 className="text-2xl font-semibold mb-4">Basic Table Example</h2>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Data Table Example */}
      <div className="rounded-md border">
        <h2 className="text-2xl font-semibold mb-4">Data Table Example</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 p-4">
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
    </div>
  );
};
