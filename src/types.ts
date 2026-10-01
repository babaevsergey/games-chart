export type Response = {
  id: number;
  name: string;
  icon: string;
  data: [date: string, downloads: number, revenue: number][];
}[];

export type Measure = 'downloads' | 'revenue';
