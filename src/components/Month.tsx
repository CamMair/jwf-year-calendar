import { MouseEventHandler } from 'react';

export type WeekStartType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const Day = (props: {
  className?: string;
  contents: string;
  onContextMenu?: MouseEventHandler<HTMLDivElement> | undefined;
}) => {
  return (
    <div
      className={`${props.className || ''} col-1 h-6 inline-block text-sm w-6`}
      onContextMenu={e => (props.onContextMenu ? props.onContextMenu(e) : null)}
    >
      {props.contents}
    </div>
  );
};

const DayNumbered = (props: { number: number }) => {
  return (
    <Day
      className="cursor-pointer hover:bg-gray-300 justify-items-center rounded-md py-1 select-none text-center text-xs"
      contents={props.number.toString()}
      onContextMenu={e => {
        e.preventDefault();
      }}
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
  index: number;
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
          return <DayNumbered key={i} number={i + 1} />;
        })}
      </div>
    </div>
  );
};

export default Month;
