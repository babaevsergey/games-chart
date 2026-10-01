import * as Highcharts from 'highcharts';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import useData from '../../../hooks/useData';

jest.mock('../../../hooks/useData');
const mockUseData = useData as jest.MockedFunction<typeof useData>;

beforeEach(() => {
  mockUseData.mockReturnValue({ data: [], loading: false, error: null });
});

describe('App', () => {
  it('shows loaders in both views and hides them when data arrives', async () => {
    mockUseData.mockReturnValue({ data: [], loading: true, error: null });
    const { rerender } = render(<App />);
    expect(screen.getByText('Loading chart...')).toBeVisible();
    expect(screen.getByRole('progressbar')).toBeVisible();
    expect(screen.getByRole('grid')).toBeInTheDocument();

    mockUseData.mockReturnValue({
      data: salesData,
      loading: false,
      error: null,
    });
    rerender(<App />);
    await waitFor(() =>
      expect(screen.getByText('Loading chart...')).not.toBeVisible(),
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: '7,000' })).toBeInTheDocument();
  });

  it('shows a loading error', () => {
    mockUseData.mockReturnValue({
      data: [],
      loading: false,
      error: 'Failed to load data (HTTP 500).',
    });
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('HTTP 500');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading chart...')).not.toBeInTheDocument();
  });

  it('renders start and end date inputs', () => {
    render(<App />);

    expect(screen.getByText(/start date/i)).toBeInTheDocument();
    expect(screen.getByText(/end date/i)).toBeInTheDocument();
  });
});

const salesData = [
  {
    id: 1,
    name: 'Example App',
    icon: 'icon.png',
    data: [
      ['2020-01-01', 1000, 100000],
      ['2020-01-02', 2000, 400000],
      ['2020-01-07', 4000, 800000],
    ],
  },
] as ReturnType<typeof useData>['data'];

const currentChart = () => Highcharts.charts.find((chart) => chart)!;

const changeDate = (label: RegExp, value: string) => {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

describe('filters and measures', () => {
  beforeEach(() => {
    mockUseData.mockReturnValue({
      data: salesData,
      loading: false,
      error: null,
    });
  });

  it('switches chart values to dollars and back without changing table totals', () => {
    render(<App />);
    expect(currentChart().series[0].data.map((point) => point.y)).toEqual([
      1000, 2000, 4000,
    ]);
    expect(screen.getByRole('gridcell', { name: '7,000' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Revenue' }));
    expect(screen.getByRole('button', { name: 'Revenue' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Revenue by App')).toBeInTheDocument();
    expect(screen.getByText('Revenue ($)')).toBeInTheDocument();
    expect(currentChart().series[0].data.map((point) => point.y)).toEqual([
      1000, 4000, 8000,
    ]);
    expect(screen.getByRole('gridcell', { name: '7,000' })).toBeInTheDocument();
    expect(
      screen.getByRole('gridcell', { name: '$13,000.00' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Downloads' }));
    expect(screen.getByText('Downloads by App')).toBeInTheDocument();
    expect(currentChart().series[0].data.map((point) => point.y)).toEqual([
      1000, 2000, 4000,
    ]);
  });

  it('filters both views inclusively, including a single-day range', () => {
    render(<App />);
    changeDate(/end date/i, '2020-01-02');
    expect(currentChart().series[0].data.map((point) => point.y)).toEqual([
      1000, 2000,
    ]);
    expect(screen.getByRole('gridcell', { name: '3,000' })).toBeInTheDocument();
    expect(screen.getByText('Jan 01, 2020 - Jan 02, 2020')).toBeInTheDocument();

    changeDate(/start date/i, '2020-01-02');
    expect(currentChart().series[0].data.map((point) => point.x)).toEqual([
      Date.UTC(2020, 0, 2),
    ]);
    expect(screen.getByRole('gridcell', { name: '2,000' })).toBeInTheDocument();
    expect(
      screen.getByRole('gridcell', { name: '$4,000.00' }),
    ).toBeInTheDocument();
  });

  it('shows no plotted points and zero totals for a period without data', () => {
    render(<App />);
    changeDate(/end date/i, '2020-02-07');
    changeDate(/start date/i, '2020-02-01');
    expect(currentChart().series[0].data).toHaveLength(0);
    expect(screen.getByRole('gridcell', { name: '0' })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: '$0.00' })).toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: '-' })).toBeInTheDocument();
  });

  it('hides results for invalid dates and restores them after correction', () => {
    render(<App />);
    changeDate(/start date/i, '2020-01-08');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Start date must not be after end date.',
    );
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(screen.queryByText('Downloads by App')).not.toBeInTheDocument();

    changeDate(/start date/i, '');
    expect(screen.getByRole('alert')).toHaveTextContent('Select both dates.');

    changeDate(/start date/i, '2020-01-01');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Downloads by App')).toBeInTheDocument();
  });
});
