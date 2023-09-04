import { isAfter, isBefore, isEqual } from '../lib/dates';
import { CalendarDate, SanitizedDataSource, SanitizedDataSourceItem } from '../lib/types';

export type WeekStartType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const DayNumbered = (props: {
  dataSource?: SanitizedDataSource;
  day: number;
  disabled?: boolean;
  endDate: CalendarDate | null;
  month: number;
  setEndDate: (x: CalendarDate | null) => unknown;
  setStartDate: (x: CalendarDate | null) => unknown;
  startDate: CalendarDate | null;
  year: number;
}) => {
  const thisDate = {
    day: props.day,
    month: props.month,
    year: props.year,
  };

  if (props.disabled) {
    return (
      <div
        className={`flex flex-col h-6 col-1 select-none inline-block justify-items-center pt-1 select-none text-center text-sm text-xs mx-0 text-gray-400`}
      >
        {props.day.toString()}
      </div>
    );
  }
  const borderClass = () => {
    if (props.startDate && isEqual(thisDate, props.startDate) && isAfter(props.endDate, props.startDate)) {
      return 'rounded-l';
    }
    if (props.startDate && isEqual(thisDate, props.endDate) && isBefore(props.endDate, props.startDate)) {
      return 'rounded-l';
    }
    if (props.startDate && isEqual(thisDate, props.endDate) && isAfter(props.endDate, props.startDate)) {
      return 'rounded-r';
    }
    if (props.startDate && isEqual(thisDate, props.startDate) && isBefore(props.endDate, props.startDate)) {
      return 'rounded-r';
    }
    if (props.startDate && !isEqual(thisDate, props.startDate) && !isEqual(thisDate, props.endDate)) {
      return '';
    }
    return 'hover:rounded';
  };

  const isBetweenDates = (test: CalendarDate, start: CalendarDate | null, end: CalendarDate | null) => {
    if (start && end) {
      if (isAfter(test, start) && isBefore(test, end)) {
        return true;
      }
      if (isAfter(test, end) && isBefore(test, start)) {
        return true;
      }
    }
    return false;
  };

  const numberOfEvents = () => {
    const e = [];
    if (props.dataSource) {
      for (let i = 0; i < props.dataSource.length; i += 1) {
        if (isBetweenDates(thisDate, props.dataSource[i].startDate, props.dataSource[i].endDate)) {
          e.push(props.dataSource[i]);
        }
      }
    }
    return e;
  };

  const isTailwindClass = (color: string) => {
    if (
      /^bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuscia|pink|rose)-(100|200|300|400|500|600|700|800|900)$/.test(
        color
      )
    ) {
      return true;
    }
    return false;
  };

  const getBookedDiv = (e: SanitizedDataSourceItem, size: 1 | 2) => {
    if (isTailwindClass(e.color)) {
      return <div className={`${e.color} h-[${size}px]`}></div>;
    }
    return <div className={`h-[${size}px]`} style={{ backgroundColor: e.color }}></div>;
  };

  const eventDivs = () => {
    const e = numberOfEvents();
    const n = e.length;
    if (n === 1) {
      return getBookedDiv(e[0], 2);
    }
    if (n === 2) {
      return (
        <>
          {getBookedDiv(e[0], 1)}
          {getBookedDiv(e[1], 1)}
        </>
      );
    }
    if (n === 3) {
      return (
        <>
          {getBookedDiv(e[0], 1)}
          {getBookedDiv(e[1], 1)}
          {getBookedDiv(e[2], 1)}
        </>
      );
    }
    if (n > 3) {
      return (
        <>
          <div className={'bg-black h-[2px]'}> </div>
        </>
      );
    }
    return false;
  };

  return (
    <div
      className={`flex flex-col h-6 col-1 hover:bg-gray-300 ${
        isBetweenDates(thisDate, props.startDate, props.endDate) ? 'bg-gray-300' : ''
      } ${borderClass()}  cursor-pointer inline-block justify-items-center pt-1 select-none text-center text-sm text-xs mx-0`}
    >
      <div
        className="flex-grow"
        onContextMenu={e => {
          e.preventDefault();
        }}
        onMouseDown={() =>
          props.setStartDate({ day: props.day, month: props.month, year: props.year }) &&
          props.setEndDate({ day: props.day, month: props.month, year: props.year })
        }
        onMouseEnter={() => props.setEndDate({ day: props.day, month: props.month, year: props.year })}
      >
        {props.day.toString()}
      </div>
      {eventDivs()}
    </div>
  );
};

const DayOfWeekHeading = (props: { name: string; disabled?: boolean }) => {
  if (props.disabled) {
    return (
      <div className="col-1 cursor-default h-6 inline-block text-sm font-bold select-none text-sm">{props.name}</div>
    );
  }
  return (
    <div className="col-1 cursor-default h-6 inline-block text-sm font-bold select-none text-sm">{props.name}</div>
  );
};

const DayPlaceholder = () => {
  return <div className="col-1 h-6 inline-block text-sm"></div>;
};

const Month = (props: {
  className?: string;
  dataSource: SanitizedDataSource;
  disabledDays?: number[];
  endDate: CalendarDate | null;
  index: number;
  setEndDate: (x: CalendarDate | null) => unknown;
  setStartDate: (x: CalendarDate | null) => unknown;
  startDate: CalendarDate | null;
  title: string;
  weekStart?: WeekStartType;
  year: number;
}) => {
  const daysInMonth = new Date(props.year, props.index + 1, 0).getDate();
  let dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  if (props.weekStart) {
    dayNames = [...dayNames.slice(props.weekStart), ...dayNames.slice(0, props.weekStart)];
  }
  const startDayOfMonth = new Date(props.year, props.index, 1).getDay();

  const monthClasses =
    'bg-white-500 h-50 inline-block items-center justify-items-center mx-11 text-black text-center w-44';

  return (
    <div className={`${props.className} ${monthClasses}`}>
      <div className="cursor-default font-bold select-none">{props.title}</div>
      <div className="grid grid-cols-7 mt-1">
        {dayNames.map((name, i) => {
          return <DayOfWeekHeading key={i} name={name} />;
        })}
        {Array.from({ length: (startDayOfMonth - (props.weekStart || 0) + 7) % 7 }).map((_, i) => {
          return <DayPlaceholder key={i} />;
        })}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayOfWeek = new Date(props.year, props.index, i + 1).getDay();
          return (
            <DayNumbered
              dataSource={props.dataSource}
              day={i + 1}
              disabled={props.disabledDays?.includes(dayOfWeek)}
              endDate={props.endDate}
              month={props.index + 1}
              key={i}
              setEndDate={props.setEndDate}
              setStartDate={props.setStartDate}
              startDate={props.startDate}
              year={props.year}
            />
          );
        })}
        <div className=""></div>
      </div>
    </div>
  );
};

export default Month;
