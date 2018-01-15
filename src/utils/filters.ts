
export function numberFilter(value: number, format: number): number{
  return Number(value.toPrecision(format));
}

export function capitalize(value: string): string{
  if (!value && typeof value !== 'string') {
    return '';
  };
  let newValue = value.toString();
  return newValue.charAt(0).toUpperCase() + newValue.slice(1);
}

export function uppercase(value: string): string{
  if (!value && typeof value !== 'string') {
    return '';
  };
  let newValue = value.toString();
  return newValue.toUpperCase();
}

export function lowercase(value: string): string{
  if (!value && typeof value !== 'string') {
    return '';
  };
  let newValue = value.toString();
  return newValue.toLowerCase();
}