
export const numberFilter = (value: number, format: number): number => {
  return Number(value.toPrecision(format));
}