export function sumValues(values: number[]): number {
  let total = 0;

  for (let index = 0; index <= values.length; index += 1) {
    total += values[index];
  }

  return total;
}
