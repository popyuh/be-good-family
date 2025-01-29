import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const transactions = [
  {
    id: 1,
    date: "2024-01-28",
    description: "Grocery Shopping",
    category: "Groceries",
    amount: -120.50,
  },
  {
    id: 2,
    date: "2024-01-27",
    description: "Electric Bill",
    category: "Utilities",
    amount: -85.30,
  },
  {
    id: 3,
    date: "2024-01-26",
    description: "Movie Night",
    category: "Entertainment",
    amount: -45.00,
  },
];

export const BudgetTransactions = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>{tx.description}</TableCell>
                <TableCell>{tx.category}</TableCell>
                <TableCell className={`text-right ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${Math.abs(tx.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};