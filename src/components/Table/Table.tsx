import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { Response } from '../../types';
import { calculateTotals } from '../../utils/data';
import { formatCurrency, formatNumber } from '../../utils/format';
import './Table.css';

type TableProps = {
  data: Response;
  loading?: boolean;
};

type RowProps = {
  id: number;
  appName: string;
  icon: string;
  downloads: number;
  revenue: number;
  rpd: number | null;
};

const columns: GridColDef<RowProps>[] = [
  {
    field: 'appName',
    headerName: 'App Name',
    width: 240,
    renderCell: ({ row }) => (
      <div className="app-cell">
        <img src={row.icon} alt="" className="app-icon" />
        <span>{row.appName}</span>
      </div>
    ),
  },
  {
    field: 'downloads',
    headerName: 'Downloads',
    width: 150,
    type: 'number',
    valueFormatter: (value: number) => formatNumber(value),
  },
  {
    field: 'revenue',
    headerName: 'Revenue',
    width: 150,
    type: 'number',
    valueFormatter: (value: number) => formatCurrency(value),
  },
  {
    field: 'rpd',
    headerName: 'RPD',
    width: 150,
    type: 'number',
    valueFormatter: (value: number | null) => formatCurrency(value),
  },
];

const Table = ({ data, loading = false }: TableProps) => {
  if (!data.length && !loading) {
    return null;
  }

  const rows: RowProps[] = data.map((app) => ({
    id: app.id,
    appName: app.name,
    icon: app.icon,
    ...calculateTotals(app.data),
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        loading={loading}
        columns={columns}
        sx={{ '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 'bold' } }}
      />
    </div>
  );
};

export default Table;
