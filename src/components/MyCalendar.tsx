import Month from './Month';

const MyCalendar = () => {
  const year = 2020;
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="grid grid-cols-4 justify-items-center">
      {months.map((month, index) => {
        return <Month className="h-50 w-44" index={index} title={month} year={year} />;
      })}
    </div>
  );
};

export default MyCalendar;
