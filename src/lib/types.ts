export type CalendarDate = { day: number; month: number; year: number };

export type DataSourceItem = {
  id: number;
  color?: string;
  endDate: CalendarDate;
  name: string;
  startDate: CalendarDate;
};

export type ContextMenuItem = {
  text: string;
};

export type SanitizedContextMenuItem = {
  text: string;
};

export type SanitizedDataSourceItem = {
  id: number;
  color: string;
  endDate: CalendarDate;
  name: string;
  startDate: CalendarDate;
};

export type DataSource = DataSourceItem[];

export type ContextMenu = ContextMenuItem[];

export type SanitizedContextMenu = SanitizedContextMenuItem[];

export type SanitizedDataSource = SanitizedDataSourceItem[];
