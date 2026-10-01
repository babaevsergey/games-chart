import type { Response } from '../../types';
import { calculateTotals, filterDataByDateRange } from '../data';

const data: Response = [
  {
    id: 1,
    name: 'App 1',
    icon: 'icon.png',
    data: [
      ['2020-01-01', 100, 101],
      ['2020-01-02', 200, 202],
      ['2020-01-03', 300, 303],
      ['2020-01-04', 400, 404],
    ],
  },
];

it('includes both date boundaries without modifying the source', () => {
  const original = JSON.parse(JSON.stringify(data));
  const filtered = filterDataByDateRange(data, '2020-01-02', '2020-01-03');

  expect(filtered[0].data.map(([date]) => date)).toEqual([
    '2020-01-02',
    '2020-01-03',
  ]);
  expect(data).toEqual(original);
  expect(calculateTotals(filtered[0].data)).toEqual({
    downloads: 500,
    revenue: 5.05,
    rpd: 5.05 / 500,
  });
});

it('supports a single-day range', () => {
  const filtered = filterDataByDateRange(data, '2020-01-02', '2020-01-02');
  expect(filtered[0].data).toEqual([['2020-01-02', 200, 202]]);
});

it('preserves apps when the range has no records', () => {
  const filtered = filterDataByDateRange(data, '2021-01-01', '2021-01-07');
  expect(filtered).toEqual([{ ...data[0], data: [] }]);
  expect(calculateTotals(filtered[0].data)).toEqual({
    downloads: 0,
    revenue: 0,
    rpd: null,
  });
});

it('calculates RPD from totals rather than averaging daily ratios', () => {
  expect(
    calculateTotals([
      ['2020-01-01', 1, 100],
      ['2020-01-02', 9, 1800],
    ]),
  ).toEqual({ downloads: 10, revenue: 19, rpd: 1.9 });
});

it('returns no RPD for an app with revenue but no downloads', () => {
  expect(calculateTotals([['2020-01-01', 0, 56000]])).toEqual({
    downloads: 0,
    revenue: 560,
    rpd: null,
  });
});
