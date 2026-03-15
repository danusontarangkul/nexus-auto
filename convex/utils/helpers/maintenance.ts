export function calculateNextDueMileage(
  currentMileage: number,
  intervalMiles?: number,
): number | undefined {
  if (!intervalMiles) {
    return undefined;
  }
  return currentMileage + intervalMiles;
}

export function calculateNextDueDate(
  serviceDate: number,
  intervalMonths?: number,
): number | undefined {
  if (!intervalMonths) {
    return undefined;
  }

  const date = new Date(serviceDate);
  date.setMonth(date.getMonth() + intervalMonths);
  return date.getTime();
}
