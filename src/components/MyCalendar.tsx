import { useState, useEffect, useRef } from 'react';
import Month from './Month';

const MyCalendar = () => {
  const myCalendarRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const year = 2023;
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

  useEffect(() => {
    let newWidth = 0;
    if (myCalendarRef?.current) {
      newWidth = myCalendarRef.current.clientWidth;
    }
    setContainerWidth(newWidth);
  }, [myCalendarRef.current?.clientWidth]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  const determineGridCols = () => {
    const minWidth = Math.min(windowWidth, containerWidth);
    if (minWidth >= 1100) {
      return 'grid-cols-6';
    }
    if (minWidth >= 756) {
      return 'grid-cols-4';
    }
    if (minWidth >= 572) {
      return 'grid-cols-3';
    }
    if (minWidth >= 386) {
      return 'grid-cols-2';
    }
    return 'grid-cols-1';
  };

  return (
    <>
      {/* <div className="container max-w-8xl bg-sky-100"> */}
      <div
        className={`grid ${determineGridCols()} justify-items-center select-none text-center w-full`}
        ref={myCalendarRef}
      >
        {months.map((month, index) => {
          return <Month index={index} key={index} title={month} year={year} />;
        })}
      </div>
      {/* </div> */}
    </>
  );
};

export default MyCalendar;
