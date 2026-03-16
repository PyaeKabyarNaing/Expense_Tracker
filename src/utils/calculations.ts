export function calculateBalance(totalIncome: number, totalExpense: number): number {
  return totalIncome - totalExpense;
}

export function calculateRemainingBudget(budgetAmount: number, spent: number): number {
  return budgetAmount - spent;
}

export function calculateBudgetProgress(budgetAmount: number, spent: number): number {
  if (budgetAmount <= 0) return 0;
  return Math.min(spent / budgetAmount, 1);
}

export function isOverBudget(budgetAmount: number, spent: number): boolean {
  return spent > budgetAmount;
}
