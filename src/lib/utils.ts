import { isAfter, isBefore } from './dates';
import { CalendarDate } from './types';

export const isHexColor = (color: string) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const isTailwindColor = (color: string) => {
  return /^bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuscia|pink|rose)-(100|200|300|400|500|600|700|800|900)$/.test(
    color
  );
};

export const determineGridCols = (windowWidth: number, containerWidth: number) => {
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

export const showYearEnd = (windowWidth: number, containerWidth: number) => {
  return Math.min(windowWidth, containerWidth) > 975;
};

export const showYearMiddle = (windowWidth: number, containerWidth: number) => {
  return Math.min(windowWidth, containerWidth) > 750;
};

export const orderDates = (one: CalendarDate, two: CalendarDate) => {
  if (isBefore(one, two)) {
    return { startDate: one, endDate: two };
  }
  if (isAfter(one, two)) {
    return { startDate: two, endDate: one };
  }
  throw new Error('orderDates method in MyCalendar failed');
};
