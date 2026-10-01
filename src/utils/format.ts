const numberFormatter = new Intl.NumberFormat('en-US');

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = (value: number): string =>
  numberFormatter.format(value);

/** Accepts dollars, not cents. Invalid values are displayed as a dash. */
export const formatCurrency = (value: number | null): string =>
  value === null || !Number.isFinite(value)
    ? '-'
    : currencyFormatter.format(value);
