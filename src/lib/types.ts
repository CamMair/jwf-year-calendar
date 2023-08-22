export type CalendarDate = { day: number; month: number; year: number };

export type DataSourceItem = {
  id: number;
  color?: string;
  endDate: CalendarDate;
  name: string;
  startDate: CalendarDate;
};

export type SanitizedDataSourceItem = {
  id: number;
  color: string;
  endDate: CalendarDate;
  name: string;
  startDate: CalendarDate;
};

export type DataSource = DataSourceItem[];

export type SanitizedDataSource = SanitizedDataSourceItem[];
