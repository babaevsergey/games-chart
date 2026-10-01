import { useState } from 'react';
import Controls from '../Controls/Controls';
import Chart from '../Chart/Chart';
import Table from '../Table/Table';
import useData from '../../hooks/useData';
import { filterDataByDateRange } from '../../utils/data';
import { validateDateRange } from '../../utils/date';
import type { Measure } from '../../types';
import './App.css';

const App = () => {
  const { data, loading, error } = useData();
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState('2020-01-07');
  const [measure, setMeasure] = useState<Measure>('downloads');

  const dateError = validateDateRange(startDate, endDate);
  const filteredData = filterDataByDateRange(data, startDate, endDate);

  return (
    <div className="container">
      <Controls
        startDate={startDate}
        endDate={endDate}
        measure={measure}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onMeasureChange={setMeasure}
      />
      {dateError && <p role="alert">{dateError}</p>}
      {error && <p role="alert">{error}</p>}
      {!error && !dateError && (
        <>
          <Chart
            data={filteredData}
            loading={loading}
            measure={measure}
            startDate={startDate}
            endDate={endDate}
          />
          <Table data={filteredData} loading={loading} />
        </>
      )}
    </div>
  );
};

export default App;
