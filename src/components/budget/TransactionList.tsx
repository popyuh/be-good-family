import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
};

type TransactionListProps = {
  transactions: Transaction[];
  onUpdateTransaction: (id: string, field: keyof Transaction, value: string) => void;
  onDeleteTransaction: (id: string) => void;
};

export const TransactionList = ({ 
  transactions,
  onUpdateTransaction,
  onDeleteTransaction
}: TransactionListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              {editingId === tx.id ? (
                <>
                  <TableCell>
                    <Input
                      type="date"
                      value={tx.date}
                      onChange={(e) => onUpdateTransaction(tx.id, 'date', e.target.value)}
                      className="w-40"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={tx.description}
                      onChange={(e) => onUpdateTransaction(tx.id, 'description', e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={tx.category}
                      onChange={(e) => onUpdateTransaction(tx.id, 'category', e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={tx.amount}
                      onChange={(e) => onUpdateTransaction(tx.id, 'amount', e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingId(null)}
                      className="w-full"
                    />
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell className={`text-right ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${Math.abs(tx.amount).toFixed(2)}
                  </TableCell>
                </>
              )}
              <TableCell>
                <div className="flex gap-1 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editingId === tx.id ? setEditingId(null) : setEditingId(tx.id)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};