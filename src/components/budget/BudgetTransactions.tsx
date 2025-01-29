import { useState, KeyboardEvent } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Transaction = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
};

export const BudgetTransactions = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      date: "2024-01-28",
      description: "Grocery Shopping",
      category: "Groceries",
      amount: -120.50,
    },
    {
      id: "2",
      date: "2024-01-27",
      description: "Electric Bill",
      category: "Utilities",
      amount: -85.30,
    },
    {
      id: "3",
      date: "2024-01-26",
      description: "Movie Night",
      category: "Entertainment",
      amount: -45.00,
    },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    category: "",
    amount: "",
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const validateTransaction = (transaction: Partial<Transaction>) => {
    if (!transaction.description?.trim()) return false;
    if (!transaction.category?.trim()) return false;
    if (typeof transaction.amount !== 'number') return false;
    if (!transaction.date) return false;
    return true;
  };

  const handleAddTransaction = (e?: KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    
    if (!newTransaction.description || !newTransaction.category || !newTransaction.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: newTransaction.date,
      description: newTransaction.description.trim(),
      category: newTransaction.category.trim(),
      amount: Number(newTransaction.amount),
    };

    if (!validateTransaction(transaction)) {
      toast({
        title: "Error",
        description: "Invalid transaction data",
        variant: "destructive",
      });
      return;
    }

    setTransactions([transaction, ...transactions]);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      description: "",
      category: "",
      amount: "",
    });
    
    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
  };

  const handleEditTransaction = (id: string, field: keyof Transaction, value: string) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === id) {
        if (field === 'amount') {
          return { ...tx, [field]: Number(value) };
        }
        return { ...tx, [field]: value.trim() };
      }
      return tx;
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className="w-40"
          />
          <Input
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            className="w-40"
          />
          <Input
            placeholder="Category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            className="w-32"
          />
          <Input
            placeholder="Amount"
            type="number"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            onKeyPress={(e) => handleAddTransaction(e as KeyboardEvent)}
            className="w-32"
          />
          <Button size="icon" onClick={() => handleAddTransaction()} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
                        onChange={(e) => handleEditTransaction(tx.id, 'date', e.target.value)}
                        className="w-40"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={tx.description}
                        onChange={(e) => handleEditTransaction(tx.id, 'description', e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={tx.category}
                        onChange={(e) => handleEditTransaction(tx.id, 'category', e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={tx.amount}
                        onChange={(e) => handleEditTransaction(tx.id, 'amount', e.target.value)}
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
                      onClick={() => handleDeleteTransaction(tx.id)}
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
    </div>
  );
};