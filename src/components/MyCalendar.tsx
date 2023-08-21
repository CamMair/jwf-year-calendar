import React, { useState, useEffect, useRef } from 'react';
import Month from './Month';
import { CalendarDate, isAfter, isBefore } from '../lib/dates';

const MyCalendar = (props: {
  enableRangeSelection?: boolean;
  onRangeSelected?: (e: { startDate: CalendarDate; endDate: CalendarDate }) => void;
}) => {
  const myCalendarRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [startDate, setStartDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [endDate, setEndDate] = useState<{ day: number; month: number; year: number } | null>(null);

  const handleSetEndDate = (d: CalendarDate | null) => {
    if (props.enableRangeSelection) {
      setEndDate(d);
    }
  };

  const handleSetStartDate = (d: CalendarDate | null) => {
    if (props.enableRangeSelection) {
      setStartDate(d);
    }
  };

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

  const orderDates = (one: CalendarDate, two: CalendarDate) => {
    if (isBefore(one, two)) {
      return { startDate: one, endDate: two };
    }
    if (isAfter(one, two)) {
      return { startDate: two, endDate: one };
    }
    throw new Error('orderDates method in MyCalendar failed');
  };

  return (
    <>
      {/* <div className="container max-w-8xl bg-sky-100"> */}
      <div
        className={`grid ${determineGridCols()} justify-items-center select-none text-center w-full`}
        ref={myCalendarRef}
        onMouseDown={() => handleSetEndDate(null)}
        onMouseUp={() => {
          if (startDate && endDate && props.onRangeSelected) {
            props.onRangeSelected(orderDates(startDate, endDate));
          }
          handleSetStartDate(null);
          return false;
        }}
        onMouseLeave={() => handleSetStartDate(null)}
      >
        {months.map((month, index) => {
          return (
            <Month
              endDate={endDate}
              index={index}
              key={index}
              setEndDate={handleSetEndDate}
              setStartDate={handleSetStartDate}
              startDate={startDate}
              title={month}
              year={year}
            />
          );
        })}
      </div>
      {/* </div> */}
    </>
  );
};

export default MyCalendar;
