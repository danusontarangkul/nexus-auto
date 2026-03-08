export const sanitizePlateInput = (value: string): string => {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
};

export const MAX_PLATE_LENGTH = 8;
