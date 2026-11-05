export function evaluatePriceFormula(formula: string): number {
  return eval(formula) as number;
}
