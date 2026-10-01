import * as Highcharts from 'highcharts';
import { render, screen } from '@testing-library/react';
import Chart from '../Chart';
import type { Response } from '../../../types';

const mockData: Response = [
  {
    id: 1,
    name: 'App 1',
    icon: 'https://example.com/icon.png',
    data: [
      ['2023-01-01', 100, 200],
      ['2023-01-02', 200, 300],
    ],
  },
  {
    id: 2,
    name: 'App 2',
    icon: 'https://example.com/icon.png',
    data: [
      ['2023-01-01', 150, 250],
      ['2023-01-02', 250, 350],
    ],
  },
];

describe('Chart', () => {
  it('renders a chart', () => {
    render(
      <Chart
        data={mockData}
        measure="downloads"
        startDate="2023-01-01"
        endDate="2023-01-02"
      />,
    );
    expect(screen.getByText('Downloads')).toBeInTheDocument();
  });

  it('renders the title and subtitle', () => {
    render(
      <Chart
        data={mockData}
        measure="downloads"
        startDate="2023-01-01"
        endDate="2023-01-02"
      />,
    );
    expect(screen.getByText('Downloads by App')).toBeInTheDocument();
    expect(screen.getByText('Jan 01, 2023 - Jan 02, 2023')).toBeInTheDocument();
  });

  it('does not render a chart if data is empty', () => {
    render(
      <Chart
        data={[]}
        measure="downloads"
        startDate="2023-01-01"
        endDate="2023-01-02"
      />,
    );
    expect(screen.queryByText('Downloads')).not.toBeInTheDocument();
  });
});

it('enables markers for a single day and disables them for multiple days', () => {
  const singleDayData = mockData.map((app) => ({
    ...app,
    data: app.data.slice(0, 1),
  }));
  const { rerender } = render(
    <Chart
      data={singleDayData}
      measure="downloads"
      startDate="2023-01-01"
      endDate="2023-01-01"
    />,
  );

  const chart = Highcharts.charts.find((chart) => chart)!;
  expect(
    chart.series.map(
      (series) =>
        series.options.type === 'line' && series.options.marker?.enabled,
    ),
  ).toEqual([true, true]);

  rerender(
    <Chart
      data={mockData}
      measure="downloads"
      startDate="2023-01-01"
      endDate="2023-01-02"
    />,
  );
  expect(
    chart.series.map(
      (series) =>
        series.options.type === 'line' && series.options.marker?.enabled,
    ),
  ).toEqual([false, false]);
});
