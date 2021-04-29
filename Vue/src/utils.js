import { dinnerTime, holidays } from './data.js';

export default class Utils {
  static isThatHoliday(holiday, startDate, endDate) {
    return holiday.date.toLocaleDateString() === startDate.toLocaleDateString() &&
      holiday.date.toLocaleDateString() === endDate.toLocaleDateString();
  }

  static isHoliday(starDate, endDate) {
    return holidays.some(function (holiday) {
      return Utils.isThatHoliday(holiday, starDate, endDate);
    });
  }

  static getHoliday(startDate, endDate) {
    for (let i = 0; i < holidays.length; i++) {
      if (Utils.isThatHoliday(holidays[i], startDate, endDate)) {
        return holidays[i];
      }
    }
  }

  static hasIntersect(startA, endA, startB, endB) {
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

    return Utils.hasIntersect(
      todayDinnerStart, todayDinnerEnd,
      startDate.getTime(), endDate.getTime()
    );
  }

  static isValidAppointmentDate(startDate, endDate) {
    return !Utils.isHoliday(startDate, endDate) && !Utils.isDinner(startDate, endDate);
  }
}
