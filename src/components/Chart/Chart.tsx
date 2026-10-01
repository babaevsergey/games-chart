import { useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import type { Measure, Response } from '../../types';
import getChartOptions from './utils/getChartOptions';

type ChartProps = {
  data: Response;
  loading?: boolean;
  measure: Measure;
  startDate: string;
  endDate: string;
};

const Chart = ({
  data,
  loading = false,
  measure,
  startDate,
  endDate,
}: ChartProps) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    if (loading) {
      chartRef.current?.chart.showLoading('Loading chart...');
    } else {
      chartRef.current?.chart.hideLoading();
    }
  }, [loading]);

  if (!data.length && !loading) {
    return null;
  }

  const options = getChartOptions(data, measure, startDate, endDate);

  return (
    <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
  );
};

export default Chart;
