export const validateDateRange = (
  startDate: string,
  endDate: string,
): string | null => {
  if (!startDate || !endDate) {
    return 'Select both dates.';
  }

  if (startDate > endDate) {
    return 'Start date must not be after end date.';
  }

  return null;
};
