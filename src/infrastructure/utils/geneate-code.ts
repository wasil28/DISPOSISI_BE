export function generateCode(base: string, index: number): string {
    const formattedNumber = String(index).padStart(2, '0');
    return `${base}${formattedNumber}`;
}
  
export function generateCodes(base: string, index: number): string {
  const formattedNumber = String(index).padStart(1, '0');
  return `${base}${formattedNumber}`;
}
