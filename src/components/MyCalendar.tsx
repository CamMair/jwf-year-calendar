import React, { useState, useEffect, useRef } from 'react';
import Month, { WeekStartType } from './Month';
import { isAfter, isBefore } from '../lib/dates';
import { CalendarDate, DataSource, SanitizedDataSource, SanitizedDataSourceItem } from '../lib/types';
import { isHexColor, isTailwindColor } from '../lib/utils';

const Year = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return (
    <button
      className={`${props.className || ''} bg-white font-bold h-11 text-2xl w-full`}
      onClick={() => (props.onClick ? props.onClick(props.year) : null)}
    >
      {props.year}
    </button>
  );
};

const YearCentre = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return (
    <Year className={`${props.className} hover:bg-gray-200 text-gray-800`} onClick={props.onClick} year={props.year} />
  );
};

const YearMiddle = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return (
    <Year
      className={`${props.className} hover:bg-gray-100 text-gray-800/50`}
      onClick={props.onClick}
      year={props.year}
    />
  );
};

const YearEnd = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return (
    <Year
      className={`${props.className} hover:bg-gray-50 text-gray-800/25`}
      onClick={props.onClick}
      year={props.year}
    />
  );
};

const MyCalendar = (props: {
  className?: string;
  weekStart?: WeekStartType;
  year?: number;
  dataSource?: DataSource;
  enableRangeSelection?: boolean;
  onRangeSelected?: (e: { startDate: CalendarDate; endDate: CalendarDate }) => void;
}) => {
  const myCalendarRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [startDate, setStartDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [endDate, setEndDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [year, setYear] = useState(props.year || new Date().getFullYear());

  let sanitizedDataSource: SanitizedDataSource = [];

  if (props.dataSource) {
    let defaultColors = ['#2C8FC9', '#9CB703', '#F5BB00', '#FF4A32', '#B56CE2', '#45A597'];
    sanitizedDataSource = props.dataSource.map(event => {
      if (event.color === undefined) {
        const sanitizedEvent = event;
        [sanitizedEvent.color] = defaultColors;
        defaultColors = [...defaultColors.slice(1), ...defaultColors.slice(0, 1)];
        return sanitizedEvent as SanitizedDataSourceItem;
      }
      if (!isTailwindColor(event.color) && !isHexColor(event.color)) {
        throw new Error(`Invalid color prop "${event.color}" provided to Calendar component`);
      }
      return event as SanitizedDataSourceItem;
    });
  }

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
    if (minWidth >= 1) {
      return 'grid-cols-1';
    }
    return 'grid-cols-6';
  };

  const showYearEnd = () => {
    return Math.min(windowWidth, containerWidth) > 975;
  };

  const showYearMiddle = () => {
    return Math.min(windowWidth, containerWidth) > 750;
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
      <div className="border border-1">
        <div className={`flex items-center justify-center`}>
          <button
            className={'bg-white font-bold h-11 hover:bg-gray-200 px-2.5 text-gray-800 text-2xl w-7'}
            onClick={() => setYear(year - 1)}
          >
            {'‹'}
          </button>
          {showYearEnd() && <YearEnd onClick={y => setYear(y)} year={year - 2} />}
          {showYearMiddle() && <YearMiddle onClick={y => setYear(y)} year={year - 1} />}
          <YearCentre onClick={y => setYear(y)} year={year} />
          {showYearMiddle() && <YearMiddle onClick={y => setYear(y)} year={year + 1} />}
          {showYearEnd() && <YearEnd onClick={y => setYear(y)} year={year + 2} />}
          <button
            className={'bg-white font-bold h-11 hover:bg-gray-200 px-2.5 text-gray-800 text-2xl w-7'}
            onClick={() => setYear(year + 1)}
          >
            {'›'}
          </button>
        </div>
      </div>
      <div
        className={`grid ${determineGridCols()} justify-items-center mt-5 select-none text-center text-sm w-full`}
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
              dataSource={sanitizedDataSource}
              endDate={endDate}
              index={index}
              key={index}
              setEndDate={handleSetEndDate}
              setStartDate={handleSetStartDate}
              startDate={startDate}
              title={month}
              weekStart={props.weekStart}
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
