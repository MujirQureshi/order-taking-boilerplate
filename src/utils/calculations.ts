import { ILineValue, ILine } from "../models";

export const calculateItemTotal = (
  fields: ILineValue[],
  price: number,
  quantity: number
) => {
  const totalFields = fields.reduce((acc, field) => acc + field.price, 0);
  return (price + totalFields) * quantity;
};

export const calculateOrderSubtotal = (lines: ILine[]) =>
  lines.reduce(
    (acc, line) =>
      acc + calculateItemTotal(line.value || [], line.price, line.quantity),
    0 as number
  );

export const calculateOrderTax = (lines: ILine[], taxPercentage: number) =>
  calculateOrderSubtotal(lines) * (taxPercentage / 100);

export const calculateOrderTotal = (lines: ILine[], taxPercentage: number) =>
  calculateOrderSubtotal(lines) + calculateOrderTax(lines, taxPercentage);
