import React, { useState, useEffect, useRef } from 'react';
import Month, { WeekStartType } from '../month/Month';
import Year from './Year';
import { sanitizeDataSource } from './SanitizedDataSource';
import hideContextMenu from './HideContextMenu';
import { relevantEvents } from '../../lib/dates';
import {
  CalendarDate,
  ContextMenuItem,
  DataSource,
  SanitizedDataSource,
  SanitizedDataSourceItem,
} from '../../lib/types';
import { determineGridCols, showYearEnd, showYearMiddle, orderDates, isTailwindColor } from '../../lib/utils';

const YearCentre = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return <Year className={`${props.className} hover:bg-gray-200 `} onClick={props.onClick} year={props.year} />;
};

const YearMiddle = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return (
    <Year
      className={`${props.className} hover:bg-gray-200 hover:opacity-50 opacity-50`}
      onClick={props.onClick}
      year={props.year}
    />
  );
};

const YearEnd = (props: { className?: string; onClick?: (year: number) => unknown; year: number }) => {
  return (
    <Year
      className={`${props.className} hover:bg-gray-200 hover:opacity-25 opacity-25`}
      onClick={props.onClick}
      year={props.year}
    />
  );
};

const MyCalendar = (props: {
  className?: string;
  darkMode?: boolean;
  weekStart?: WeekStartType;
  year?: number;
  dataSource?: DataSource;
  contextMenuItems?: ContextMenuItem[];
  disabledWeekDays?: Array<number>;
  enableRangeSelection?: boolean;
  onRangeSelected?: (e: { startDate: CalendarDate; endDate: CalendarDate }) => void;
  onYearChanged?: (y: { currentYear: number }) => unknown;
}) => {
  const myCalendarRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [startDate, setStartDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [endDate, setEndDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
  const [internalYear, setInternalYear] = useState(props.year || new Date().getFullYear());

  let sanitizedDataSource: SanitizedDataSource = [];
  if (props.dataSource) {
    sanitizedDataSource = sanitizeDataSource(props.dataSource);
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

  const handleSetYear = (y: number) => {
    setInternalYear(y);
    if (props.onYearChanged) {
      props.onYearChanged({ currentYear: y });
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

  const handleShowContextMenuItems = (i: number) => {
    setContextMenuItems({ hoverIndex: i, visible: true });
  };

  useEffect(() => {
    const handleHideContextMenu = (e: MouseEvent) => {
      hideContextMenu(e, contextMenu, setContextMenu);
    };

    document.addEventListener('click', handleHideContextMenu);

    return () => {
      document.removeEventListener('click', handleHideContextMenu);
    };
  }, [contextMenu]);

  const gridCols = determineGridCols(windowWidth, containerWidth);

  const getColorDiv = (e: SanitizedDataSourceItem) => {
    if (isTailwindColor(e.color)) {
      return <div className={`${e.color} h-9`}></div>;
    }
    return <div className={'flex-none h-full w-1 '} style={{ backgroundColor: e.color }}></div>;
  };

  const year = props.year || internalYear;

  return (
    <>
      <div className="border border-1">
        <div className={`flex items-center justify-center`}>
          <button
            className={'font-bold h-11 hover:bg-gray-200 px-2.5 text-2xl w-7'}
            onClick={() => handleSetYear(props.year ? props.year - 1 : year - 1)}
          >
            {'‹'}
          </button>
          {showYearEnd(windowWidth, containerWidth) && <YearEnd onClick={y => handleSetYear(y)} year={year - 2} />}
          {showYearMiddle(windowWidth, containerWidth) && (
            <YearMiddle onClick={y => handleSetYear(y)} year={year - 1} />
          )}
          <YearCentre onClick={y => handleSetYear(y)} year={year} />
          {showYearMiddle(windowWidth, containerWidth) && (
            <YearMiddle onClick={y => handleSetYear(y)} year={year + 1} />
          )}
          {showYearEnd(windowWidth, containerWidth) && <YearEnd onClick={y => handleSetYear(y)} year={year + 2} />}
          <button
            className={'font-bold h-11 hover:bg-gray-200 px-2.5 text-2xl w-7'}
            onClick={() => handleSetYear(year + 1)}
          >
            {'›'}
          </button>
        </div>
      </div>
      <div
        className={`grid ${gridCols} justify-items-center mt-5 select-none text-center text-sm w-full`}
        ref={myCalendarRef}
        onMouseDown={() => handleSetEndDate(null)}
        onMouseUp={e => {
          if (startDate && e.button === 0 && props.onRangeSelected) {
            props.onRangeSelected(orderDates(startDate, endDate || startDate));
          }
          handleSetStartDate(null);
          return false;
        }}
        onMouseLeave={() => handleSetStartDate(null)}
      >
        {months.map((month, index) => {
          return (
            <Month
              darkMode={props.darkMode}
              dataSource={sanitizedDataSource}
              disabledWeekDays={props.disabledWeekDays}
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
              <div className="flex relative" key={i}>
                <div
                  id="contextmenutile"
                  className={`border border-gray-200 border-solid cursor-pointer flex items-center ${
                    props.darkMode
                      ? 'bg-gray-800 hover:bg-gray-600 text-white'
                      : 'bg-white hover:bg-gray-200 text-black'
                  } h-9 shadow-xl select-none w-full`}
                  onMouseEnter={() => handleShowContextMenuItems(i)}
                >
                  {getColorDiv(event)}
                  <div className={'flex-auto inline pl-2 '}>{event.name}</div>
                  <div className={'flex-none inline px-2'}>{'›'}</div>
                </div>
                {i === contextMenuItems.hoverIndex && contextMenuItems.visible && (
                  <div className="flex">
                    <div className={'absolute flex flex-col w-max'}>
                      {props.contextMenuItems?.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => item.onClick(event)}
                          className={`border border-gray-200 border-solid cursor-pointer ${
                            props.darkMode
                              ? 'bg-slate-800 hover:bg-slate-600 text-white'
                              : 'bg-white hover:bg-slate-200 text-black'
                          } flex-auto flex  h-9 hover: items-center px-2 shadow-xl select-none w-full`}
                        >
                          {item.text}
                        </div>
                      ))}
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
