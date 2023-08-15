const Day = (props: { className?: string; contents: string }) => {
  return <div className={`${props.className || ''} col-1 inline-block h-6 w-6`}>{props.contents}</div>;
};

const DayNumbered = (props: { number: number }) => {
  return <Day contents={props.number.toString()} />;
};

const DayOfWeekHeading = (props: { name: string }) => {
  return <Day className="font-bold" contents={props.name} />;
};

const DayPlaceholder = () => {
  return <Day contents=" " />;
};

const Month = (props: { className?: string; index: number; title: string; year: number }) => {
  const daysInMonth = new Date(props.year, props.index + 1, 0).getDate();
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const startDayOfMonth = new Date(props.year, props.index, 1).getDay();
  const monthClasses = 'bg-white-500 text-black text-center flex flex-col items-center';

  return (
    <div className={`${props.className} ${monthClasses}`}>
      <div className="font-bold">{props.title}</div>
      <div className="grid grid-cols-7 ">
        {dayNames.map(name => {
          return <DayOfWeekHeading name={name} />;
        })}
        {Array.from({ length: startDayOfMonth }).map(() => {
          return <DayPlaceholder />;
        })}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          return <DayNumbered number={i + 1} />;
        })}
      </div>
    </div>
  );
};

export default Month;
