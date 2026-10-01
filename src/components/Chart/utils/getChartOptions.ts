import * as Highcharts from 'highcharts';
import { dayjsUtc } from '../../../dayjs';
import type { Measure, Response } from '../../../types';

const getChartOptions = (
  data: Response,
  measure: Measure,
  startDate: string,
  endDate: string,
): Highcharts.Options => {
  const isRevenue = measure === 'revenue';

  return {
    title: {
      text: isRevenue ? 'Revenue by App' : 'Downloads by App',
    },
    subtitle: {
      text: `${dayjsUtc(startDate).format('MMM DD, YYYY')} - ${dayjsUtc(endDate).format('MMM DD, YYYY')}`,
    },
    yAxis: {
      title: {
        text: isRevenue ? 'Revenue ($)' : 'Downloads',
      },
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter() {
          return dayjsUtc(this.value).format("MMM DD, YY'");
        },
      },
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: { hover: { enabled: false } },
        },
      },
    },
    series: data.map((app) => ({
      name: app.name,
      type: 'line',
      marker: { enabled: app.data.length === 1 },
      data: app.data.map(([date, downloads, revenue]) => ({
        x: dayjsUtc(date).valueOf(),
        y: isRevenue ? revenue / 100 : downloads,
      })),
    })),
  };
};

export default getChartOptions;
