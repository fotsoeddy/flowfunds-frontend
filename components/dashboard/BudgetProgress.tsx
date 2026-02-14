"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function BudgetProgress() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [spending, setSpending] = useState<any>({}); // Category -> Amount

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, transactionsRes] = await Promise.all([
          api.getBudgetLimits(),
          api.getTransactions()
        ]);
        
        setBudgets(budgetRes.data);
        
        // Calculate spending per category
        const spendingMap: any = {};
        transactionsRes.data.forEach((t: any) => {
            if (t.type === 'expense' && t.category) {
                spendingMap[t.category] = (spendingMap[t.category] || 0) + Number(t.amount);
            }
        });
        setSpending(spendingMap);
        
      } catch (error) {
        console.error("Failed to fetch budget data", error);
      }
    };
    
    fetchData();
  }, []);

  if (budgets.length === 0) {
    return (
      <AddBudgetDialog onSuccess={() => window.location.reload()} />
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Budget Progress</CardTitle>
        <AddBudgetDialog onSuccess={() => window.location.reload()} trigger={<Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>} />
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.map((budget: any) => {
          const spent = spending[budget.category] || 0;
          const percentage = Math.min((spent / budget.amount) * 100, 100);
          const isOver = spent > budget.amount;
          
          return (
            <div key={budget.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{budget.category}</span>
                <span className={isOver ? "text-red-500" : "text-gray-500"}>
                  {spent.toLocaleString()} / {Number(budget.amount).toLocaleString()}
                </span>
              </div>
              <Progress value={percentage} className={`h-2 ${isOver ? "bg-red-100" : ""}`} />
              {isOver && (
                 <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Over budget!
                 </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AddBudgetDialog({ onSuccess, trigger }: { onSuccess: () => void, trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createBudgetLimit({ category, amount: Number(amount) });
            toast.success("Budget set successfully!");
            setOpen(false);
            onSuccess();
        } catch (error) {
            toast.error("Failed to set budget");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" className="w-full border-dashed"><Plus className="mr-2 h-4 w-4" /> Set a Budget</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Monthly Budget</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Input placeholder="e.g. Food" value={category} onChange={e => setCategory(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Limit Amount</Label>
                        <Input type="number" placeholder="50000" value={amount} onChange={e => setAmount(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600" disabled={loading}>
                        {loading ? "Saving..." : "Save Budget"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
