import { CalendarDate, SanitizedDataSource } from './types';

export const isAfter = (test: CalendarDate | null, reference: CalendarDate | null) => {
  if (test && reference) {
    if (test.year > reference.year) {
      return true;
    }
    if (test.month > reference.month && test.year === reference.year) {
      return true;
    }
    if (test.day >= reference.day && test.month === reference.month && test.year === reference.year) {
      return true;
    }
  }
  return false;
};

export const isBefore = (test: CalendarDate | null, reference: CalendarDate | null) => {
  if (test && reference) {
    if (test.year < reference.year) {
      return true;
    }
    if (test.month < reference.month && test.year === reference.year) {
      return true;
    }
    if (test.day <= reference.day && test.month === reference.month && test.year === reference.year) {
      return true;
    }
  }
  return false;
};

export const isEqual = (test: CalendarDate | null, reference: CalendarDate | null) => {
  if (test && reference) {
    if (test.month === reference.month && test.day === reference.day && test.year === reference.year) {
      return true;
    }
  }
  return false;
};

export const isBetweenDates = (test: CalendarDate, start: CalendarDate | null, end: CalendarDate | null) => {
  if (start && end) {
    if (isAfter(test, start) && isBefore(test, end)) {
      return true;
    }
    if (isAfter(test, end) && isBefore(test, start)) {
      return true;
    }
  }
  return false;
};

export const relevantEvents = (
  date: { day: number; month: number; year: number },
  events: SanitizedDataSource | undefined
) => {
  const e = [];
  if (events) {
    for (let i = 0; i < events.length; i += 1) {
      if (isBetweenDates(date, events[i].startDate, events[i].endDate)) {
        e.push(events[i]);
      }
    }
  }
  return e;
};
