export type CalendarDate = { day: number; month: number; year: number };

export type DataSourceItem = {
  id: string;
  color?: string;
  endDate: CalendarDate;
  name: string;
  startDate: CalendarDate;
};

export type ContextMenuItem = {
  text: string;
  onClick: (e: DataSourceItem) => unknown;
};

export type SanitizedDataSourceItem = {
  id: string;
  color: string;
  endDate: CalendarDate;
  name: string;
  startDate: CalendarDate;
};

export type DataSource = DataSourceItem[];

export type ContextMenu = ContextMenuItem[];

export type SanitizedDataSource = SanitizedDataSourceItem[];
