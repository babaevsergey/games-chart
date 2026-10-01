import type { Response } from '../types';

/** Dates must use the YYYY-MM-DD format. Both boundaries are inclusive. */
export const filterDataByDateRange = (
  data: Response,
  startDate: string,
  endDate: string,
): Response =>
  data.map((app) => ({
    ...app,
    data: app.data.filter(([date]) => date >= startDate && date <= endDate),
  }));

/** Sum revenue in cents first; return revenue and RPD in dollars. */
export const calculateTotals = (data: Response[number]['data']) => {
  const totals = data.reduce(
    (result, [, downloads, revenueCents]) => ({
      downloads: result.downloads + downloads,
      revenueCents: result.revenueCents + revenueCents,
    }),
    { downloads: 0, revenueCents: 0 },
  );

  const revenue = totals.revenueCents / 100;
  const rpd = revenue / totals.downloads;

  return {
    downloads: totals.downloads,
    revenue,
    rpd: Number.isFinite(rpd) ? rpd : null,
  };
};
