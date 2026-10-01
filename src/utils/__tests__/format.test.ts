import { formatCurrency, formatNumber } from '../format';

it('formats downloads with thousands separators', () => {
  expect(formatNumber(80000)).toBe('80,000');
  expect(formatNumber(0)).toBe('0');
});

it('formats dollar amounts with commas and two decimal places', () => {
  expect(formatCurrency(140043.51)).toBe('$140,043.51');
  expect(formatCurrency(0)).toBe('$0.00');
  expect(formatCurrency(0.737)).toBe('$0.74');
});

it.each([null, NaN, Infinity, -Infinity])(
  'displays a dash for invalid currency: %s',
  (value) => expect(formatCurrency(value)).toBe('-'),
);
