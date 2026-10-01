import type { Measure } from '../../types';
import './Controls.css';

type ControlsProps = {
  startDate: string;
  endDate: string;
  measure: Measure;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onMeasureChange: (value: Measure) => void;
};

const Controls = ({
  startDate,
  endDate,
  measure,
  onStartDateChange,
  onEndDateChange,
  onMeasureChange,
}: ControlsProps) => (
  <div>
    <p>
      <label>
        Start Date:{' '}
        <input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
        />
      </label>
    </p>
    <p>
      <label>
        End Date:{' '}
        <input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
        />
      </label>
    </p>
    <div className="measure-buttons">
      <button
        type="button"
        aria-pressed={measure === 'downloads'}
        onClick={() => onMeasureChange('downloads')}
      >
        Downloads
      </button>
      <button
        type="button"
        aria-pressed={measure === 'revenue'}
        onClick={() => onMeasureChange('revenue')}
      >
        Revenue
      </button>
    </div>
  </div>
);

export default Controls;
