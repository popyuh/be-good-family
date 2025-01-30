import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";

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

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transaction,
    };
    setTransactions([newTransaction, ...transactions]);
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
        <TransactionForm onAddTransaction={handleAddTransaction} />
      </div>

      <TransactionList
        transactions={transactions}
        onUpdateTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
};