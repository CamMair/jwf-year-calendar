import { MouseEventHandler } from 'react';

type CalendarDate = { day: number; month: number; year: number };

const Day = (props: {
  className?: string;
  contents: string;
  onContextMenu?: MouseEventHandler<HTMLDivElement> | undefined;
  onMouseDown?: MouseEventHandler;
  onMouseUp?: MouseEventHandler;
  onMouseEnter?: MouseEventHandler;
}) => {
  return (
    <div
      className={`${props.className || ''} col-1 h-6 inline-block text-sm w-6`}
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
  const isAfterStartDate = () => {
    if (props.startDate) {
      if (
        (props.startDate?.month <= props.month && props.startDate.day <= props.day) ||
        props.startDate?.month < props.month
      ) {
        return true;
      }
    }
    return false;
  };

  const isAfterEndDate = () => {
    if (props.endDate) {
      if (
        (props.endDate?.month <= props.month && props.endDate.day <= props.day) ||
        props.endDate?.month < props.month
      ) {
        return true;
      }
    }
    return false;
  };

  const isBeforeEndDate = () => {
    if (props.endDate) {
      if (
        (props.endDate?.month >= props.month && props.endDate.day >= props.day) ||
        props.endDate?.month > props.month
      ) {
        return true;
      }
    }
    return false;
  };
  const isBeforeStartDate = () => {
    if (props.startDate) {
      if (
        (props.startDate?.month >= props.month && props.startDate.day >= props.day) ||
        props.startDate?.month > props.month
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <Day
      className={`cursor-pointer hover:bg-gray-300 ${isAfterStartDate() ? 'bg-gray-300' : ''} ${
        isBeforeEndDate() ? 'bg-gray-30' : ''
      }  ${isAfterEndDate() ? '' : ''} ${
        isBeforeStartDate() ? '' : ''
      } justify-items-center rounded-md py-1 select-none text-center text-xs`}
      contents={props.day.toString()}
      onContextMenu={e => {
        e.preventDefault();
      }}
      onMouseDown={() => props.setStartDate({ day: props.day, month: props.month, year: props.year })}
      onMouseUp={() => props.setEndDate({ day: props.day, month: props.month, year: props.year })}
      onMouseEnter={() => console.log({ day: props.day, month: props.month, year: props.year })}
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
  title: string;
  year: number;
  setEndDate: (x: CalendarDate | null) => unknown;
  setStartDate: (x: CalendarDate | null) => unknown;
  startDate: CalendarDate | null;
}) => {
  const daysInMonth = new Date(props.year, props.index + 1, 0).getDate();
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
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
        {Array.from({ length: startDayOfMonth }).map((_, i) => {
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
