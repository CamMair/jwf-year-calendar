export type CalendarDate = { day: number; month: number; year: number };

export const isAfter = (test: CalendarDate | null, reference: CalendarDate | null) => {
  if (test && reference) {
    if (test.month > reference.month) {
      return true;
    }
    if (test.day >= reference.day && test.month === reference.month) {
      return true;
    }
  }
  return false;
};

export const isBefore = (test: CalendarDate | null, reference: CalendarDate | null) => {
  if (test && reference) {
    if (test.month < reference.month) {
      return true;
    }
    if (test.day <= reference.day && test.month === reference.month) {
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
