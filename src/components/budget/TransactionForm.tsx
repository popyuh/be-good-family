import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type TransactionFormProps = {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
};

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const { toast } = useToast();
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: "",
    category: "",
    amount: "",
  });

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

    onAddTransaction({
      date: newTransaction.date,
      description: newTransaction.description.trim(),
      category: newTransaction.category.trim(),
      amount: Number(newTransaction.amount),
    });

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

  return (
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
  );
};