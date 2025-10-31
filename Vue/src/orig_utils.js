import { dinnerTime, holiday } from './data.js';

export default class Utils {
  static isHoliday(startDate, endDate) {
    return holiday.date.toLocaleDateString() === startDate.toLocaleDateString() &&
      holiday.date.toLocaleDateString() === endDate.toLocaleDateString();
  }

  static hasIntersection(startA, endA, startB, endB) {
    if ((startA <= startB && endB <= endA) ||
      (startB <= startA && endA <= endB)) {
      return true;
    }

    return (startA < startB && startB < endA) ||
      (startA < endB && endB < endA);
  }

  static isDinner(startDate, endDate) {
    var todayDinnerStart = new Date(startDate).setHours(dinnerTime.start, 0, 0, 0);
    var todayDinnerEnd = new Date(endDate).setHours(dinnerTime.end, 0, 0, 0);

    return Utils.hasIntersection(
      todayDinnerStart, todayDinnerEnd,
      startDate.getTime(), endDate.getTime()
    );
  }

  static isValidAppointmentDate(startDate, endDate) {
    return !Utils.isHoliday(startDate, endDate) && !Utils.isDinner(startDate, endDate);
  }

  static getHoliday() {
    return holiday;
  }
}
