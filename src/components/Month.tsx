import { MouseEventHandler } from 'react';
import { CalendarDate, isAfter, isBefore, isEqual } from '../lib/dates';

export type WeekStartType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const Day = (props: {
  className?: string;
  contents: string;
  onContextMenu?: MouseEventHandler<HTMLDivElement> | undefined;
  onMouseDown?: MouseEventHandler;
  onMouseMove?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
}) => {
  return (
    <div
      className={`${props.className || ''} col-1 h-6 inline-block text-sm`}
      onContextMenu={e => (props.onContextMenu ? props.onContextMenu(e) : null)}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
    >
      {props.contents}
    </div>
  );
};

const DayNumbered = (props: {
  day: number;
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

  const isBetweenDates = () => {
    if (props.startDate && props.endDate) {
      if (isAfter(thisDate, props.startDate) && isBefore(thisDate, props.endDate)) {
        return true;
      }
      if (isAfter(thisDate, props.endDate) && isBefore(thisDate, props.startDate)) {
        return true;
      }
    }
    return false;
  };

  return (
    <Day
      className={`cursor-pointer hover:bg-gray-300 ${
        isBetweenDates() ? 'bg-gray-300' : ''
      } justify-items-center py-1 select-none text-center text-xs mx-0 ${borderClass()}`}
      contents={props.day.toString()}
      onContextMenu={e => {
        e.preventDefault();
      }}
      onMouseDown={() =>
        props.setStartDate({ day: props.day, month: props.month, year: props.year }) &&
        props.setEndDate({ day: props.day, month: props.month, year: props.year })
      }
      onMouseEnter={() => props.setEndDate({ day: props.day, month: props.month, year: props.year })}
    />
  );
};

const DayOfWeekHeading = (props: { name: string }) => {
  return <Day className="cursor-default font-bold select-none text-sm" contents={props.name} />;
};

const DayPlaceholder = () => {
  return <Day contents=" " />;
};

const Month = (props: {
  className?: string;
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
    'mx-11 bg-white-500 h-50 inline-block items-center justify-items-center text-black text-center w-44';

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
          return (
            <DayNumbered
              day={i + 1}
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
      </div>
    </div>
  );
};

export default Month;
