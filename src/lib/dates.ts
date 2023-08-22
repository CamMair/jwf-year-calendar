import { CalendarDate } from './types';

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
