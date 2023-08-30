import React, { useState, useEffect, useRef } from 'react';
import Month, { WeekStartType } from '../month/Month';
import { isAfter, isBefore, relevantEvents } from '../../lib/dates';
import {
  CalendarDate,
  ContextMenuItem,
  SanitizedContextMenu,
  SanitizedContextMenuItem,
  DataSource,
  SanitizedDataSource,
  SanitizedDataSourceItem,
} from '../../lib/types';
import { isHexColor, isTailwindColor } from '../../lib/utils';

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
  contextMenuItem?: ContextMenuItem;
  enableRangeSelection?: boolean;
  onRangeSelected?: (e: { startDate: CalendarDate; endDate: CalendarDate }) => void;
}) => {
  const myCalendarRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [startDate, setStartDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [endDate, setEndDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // const [selectedEvent, setSelectedEvent] = useState<SanitizedDataSourceItem | null>(null);
  const [contextMenuItems, setContextMenuItems] = useState<{ hoverIndex: number; visible: boolean }>({
    hoverIndex: 0,
    visible: false,
  });
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    day: number;
    month: number;
    year: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    day: 0,
    month: 0,
    year: 0,
  });
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

  const hideContextMenu = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      if (e.target.id === 'contextmenutile' || e.target.parentElement?.id === 'contextmenutile') {
        return;
      }
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleShowContextMenuItems = (i: number) => {
    setContextMenuItems({ hoverIndex: i, visible: true });
  };

  console.log(contextMenuItems);

  useEffect(() => {
    document.addEventListener('click', hideContextMenu);

    return () => {
      document.removeEventListener('click', hideContextMenu);
    };
  }, [contextMenu]);

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

  const getColorDiv = (e: SanitizedDataSourceItem) => {
    if (isTailwindColor(e.color)) {
      return <div className={`${e.color} h-9`}></div>;
    }
    return <div className={'flex-none h-full w-1 '} style={{ backgroundColor: e.color }}></div>;
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
              setContextMenu={setContextMenu}
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
      {contextMenu.visible && (
        <div
          className="absolute"
          onContextMenu={e => e.preventDefault()}
          onMouseLeave={() => setContextMenuItems({ hoverIndex: 0, visible: false })}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {relevantEvents({ ...contextMenu }, sanitizedDataSource).map((event, i) => {
            return (
              <div className="flex relative">
                <div
                  id="contextmenutile"
                  className={`border border-gray-200 border-solid bg-white cursor-pointer flex items-center shadow-xl select-none h-9 hover:bg-gray-200 w-full`}
                  key={i}
                  onClick={() => console.log('hello')}
                  onMouseEnter={() => handleShowContextMenuItems(i)}
                >
                  {getColorDiv(event)}
                  <div className={'flex-auto inline pl-2 '}>{event.name}</div>
                  <div className={'flex-none inline px-2'}>{'›'}</div>
                </div>
                {i === contextMenuItems.hoverIndex && contextMenuItems.visible && (
                  <div className="flex">
                    <div className={'absolute flex flex-col w-max'}>
                      <div className="border border-gray-200 border-solid bg-white cursor-pointer flex items-center  shadow-xl select-none h-9 w-full hover:bg-gray-200 px-2 flex-auto inline">
                        {props.contextMenuItem?.text}
                      </div>
                      <div className="border border-gray-200 border-solid bg-white cursor-pointer flex items-center  align-middle shadow-xl select-none h-9 w-full hover:bg-gray-200 px-2 flex-auto inline">
                        {props.contextMenuItem?.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MyCalendar;
