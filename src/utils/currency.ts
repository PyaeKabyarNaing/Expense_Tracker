export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return amount < 0 ? `-$${formatted}` : `$${formatted}`;
}
