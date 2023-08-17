import React, { useState, useEffect, useRef } from 'react';
import Month from './Month';

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

const MyCalendar = (props: { year?: number; className?: string }) => {
  const myCalendarRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [year, setYear] = useState(props.year || new Date().getFullYear());
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
    console.log('current width: ', minWidth);
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

  const yearBP1 = () => {
    const minWidth = Math.min(windowWidth, containerWidth);
    if (minWidth <= 975) {
      return 'hidden';
    }
    return '';
  };

  const yearBP2 = () => {
    const minWidth = Math.min(windowWidth, containerWidth);
    if (minWidth <= 750) {
      return 'hidden';
    }
    return '';
  };
  return (
    <>
      {/* <div className="container max-w-8xl bg-sky-100"> */}
      <div className="border border-1">
        <div className={`${yearBP1} flex items-center justify-center`}>
          <button
            className={'bg-white font-bold h-11 hover:bg-gray-200 px-2.5 text-gray-800 text-2xl w-7'}
            onClick={() => setYear(year - 1)}
          >
            {'‹'}
          </button>
          <YearEnd className={yearBP2()} onClick={y => setYear(y)} year={year - 2} />
          <YearMiddle className={yearBP1()} onClick={y => setYear(y)} year={year - 1} />
          <YearCentre onClick={y => setYear(y)} year={year} />
          <YearMiddle className={yearBP1()} onClick={y => setYear(y)} year={year + 1} />
          <YearEnd className={yearBP2()} onClick={y => setYear(y)} year={year + 2} />
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
      >
        {months.map((month, index) => {
          return <Month index={index} title={month} year={year} />;
        })}
      </div>
      {/* </div> */}
    </>
  );
};

export default MyCalendar;
