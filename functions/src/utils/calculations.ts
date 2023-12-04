export const calculateItemTotal = (
    fields: any[],
    price: number,
    quantity: number
) => {
  const totalFields = fields.reduce((acc, field) => acc + field.price, 0);
  return (price + totalFields) * quantity;
};

export const calculateOrderSubtotal = (lines: any[]) =>
  lines.reduce((acc, line) => acc + calculateItemTotal(
      line.value,
      line.price,
      line.quantity
  ), 0 as number);

export const calculateOrderTax = (lines: any[], taxPercentage: number) =>
  calculateOrderSubtotal(lines) * (taxPercentage/100);

export const calculateOrderTotal = (lines: any[], taxPercentage: number) =>
  calculateOrderSubtotal(lines) + calculateOrderTax(lines, taxPercentage);
