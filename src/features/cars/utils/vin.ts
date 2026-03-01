export const VIN_LENGTH = 17;
export const allowedCharsRegex = /^[A-HJ-NPR-Z0-9*]+$/;

export const getVinHelperMessage = (rawVin: string): string => {
  const vin = rawVin.trim().toUpperCase();

  if (!vin) {
    return '';
  }

  return `${vin.length}/${VIN_LENGTH}`;
};

export const validateVinOnSubmit = (rawVin: string): string | null => {
  const vin = rawVin.trim().toUpperCase();

  if (!vin) {
    return 'VIN is required.';
  }

  if (vin.length < 11 || vin.length > 17) {
    return 'VIN must be between 11 and 17 characters.';
  }

  if (!allowedCharsRegex.test(vin)) {
    return 'VIN can only contain letters (except I, O, Q), numbers, and *.';
  }

  return null;
};

export const normalizeVin = (rawVin: string): string =>
  rawVin.trim().toUpperCase();

export const sanitizeVinInput = (rawVin: string): string => {
  const normalized = normalizeVin(rawVin);

  const filtered = (normalized.match(allowedCharsRegex) ?? []).join('');

  return filtered.slice(0, VIN_LENGTH);
};
