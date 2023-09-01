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
  contextMenuItems?: ContextMenuItem[];
  enableRangeSelection?: boolean;
  onRangeSelected?: (e: { startDate: CalendarDate; endDate: CalendarDate }) => void;
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
  const [year, setYear] = useState(props.year || new Date().getFullYear());

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

  const yearEndShown = showYearEnd;

  const yearMiddleShown = showYearMiddle;

  const checkDates = orderDates;

  const getColorDiv = (e: SanitizedDataSourceItem) => {
    if (isTailwindColor(e.color)) {
      return <div className={`${e.color} h-9`}></div>;
    }
    return <div className={'flex-none h-full w-1 '} style={{ backgroundColor: e.color }}></div>;
  };

  return (
    <>
      <div className="border border-1">
        <div className={`flex items-center justify-center`}>
          <button
            className={'bg-white font-bold h-11 hover:bg-gray-200 px-2.5 text-gray-800 text-2xl w-7'}
            onClick={() => setYear(year - 1)}
          >
            {'‹'}
          </button>
          {yearEndShown(windowWidth, containerWidth) && <YearEnd onClick={y => setYear(y)} year={year - 2} />}
          {yearMiddleShown(windowWidth, containerWidth) && <YearMiddle onClick={y => setYear(y)} year={year - 1} />}
          <YearCentre onClick={y => setYear(y)} year={year} />
          {yearMiddleShown(windowWidth, containerWidth) && <YearMiddle onClick={y => setYear(y)} year={year + 1} />}
          {yearEndShown(windowWidth, containerWidth) && <YearEnd onClick={y => setYear(y)} year={year + 2} />}
          <button
            className={'bg-white font-bold h-11 hover:bg-gray-200 px-2.5 text-gray-800 text-2xl w-7'}
            onClick={() => setYear(year + 1)}
          >
            {'›'}
          </button>
        </div>
      </div>
      <div
        className={`grid ${gridCols} justify-items-center mt-5 select-none text-center text-sm w-full`}
        ref={myCalendarRef}
        onMouseDown={() => handleSetEndDate(null)}
        onMouseUp={() => {
          if (startDate && endDate && props.onRangeSelected) {
            props.onRangeSelected(checkDates(startDate, endDate));
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
                  className={`border border-gray-200 border-solid bg-white cursor-pointer flex items-center h-9 hover:bg-gray-200 shadow-xl select-none w-full`}
                  key={i}
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
                          onClick={() => item.onClick(item)}
                          className="border border-gray-200 border-solid bg-white cursor-pointer flex-auto inline flex  h-9 hover:bg-gray-200 items-center px-2 shadow-xl select-none w-full"
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
