export const getVinHelperMessage = (rawVin: string): string => {
  const vin = rawVin.trim().toUpperCase();

  if (!vin) return '';

  if (vin.length < 11) {
    return 'VIN must be between 11 and 17 characters.';
  }

  if (vin.length >= 11 && vin.length < 17) {
    return 'Incomplete VIN – we can still look up matching vehicles.';
  }

  if (vin.length === 17) {
    return 'Complete VIN detected.';
  }

  if (vin.length > 17) {
    return 'VIN is too long (max 17 characters).';
  }

  return '';
};

export const validateVinOnSubmit = (rawVin: string): string | null => {
  const vin = rawVin.trim().toUpperCase();

  if (!vin) {
    return 'VIN is required.';
  }

  if (vin.length < 11 || vin.length > 17) {
    return 'VIN must be between 11 and 17 characters.';
  }

  // Allowed: A–Z (except I, O, Q), 0–9, and *
  const allowedCharsRegex = /^[A-HJ-NPR-Z0-9*]+$/;
  if (!allowedCharsRegex.test(vin)) {
    return 'VIN can only contain letters (except I, O, Q), numbers, and *.';
  }

  return null;
};

export const normalizeVin = (rawVin: string): string =>
  rawVin.trim().toUpperCase();
