export function isValidVIN(candidate: string): boolean {
  const vin = candidate.trim().toUpperCase();
  if (!/^(?!.*[IOQ])[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return false;
  return vinCheckDigitOk(vin);
}
export function extractVINFromText(text: string): string | null {
  if (!text) return null;
  const matches = text.toUpperCase().match(/[A-HJ-NPR-Z0-9]{17}/g) || [];
  for (const m of matches) if (!/[IOQ]/.test(m) && vinCheckDigitOk(m)) return m;
  return null;
}
function transliterate(char: string): number {
  const map: Record<string, number> = {
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    G: 7,
    H: 8,
    J: 1,
    K: 2,
    L: 3,
    M: 4,
    N: 5,
    P: 7,
    R: 9,
    S: 2,
    T: 3,
    U: 4,
    V: 5,
    W: 6,
    X: 7,
    Y: 8,
    Z: 9,
  };
  if (/^[0-9]$/.test(char)) return parseInt(char, 10);
  return map[char] ?? 0;
}
function vinCheckDigitOk(vin: string): boolean {
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 17; i++) sum += transliterate(vin[i]) * weights[i];
  const remainder = sum % 11;
  const check = remainder === 10 ? 'X' : String(remainder);
  return vin[8] === check;
}
