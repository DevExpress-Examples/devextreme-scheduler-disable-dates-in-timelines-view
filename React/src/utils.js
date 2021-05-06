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
    const todayDinnerStart = new Date(startDate).setHours(dinnerTime.start, 0, 0, 0);
    const todayDinnerEnd = new Date(endDate).setHours(dinnerTime.end, 0, 0, 0);

    return Utils.hasIntersection(
      todayDinnerStart, todayDinnerEnd,
      startDate.getTime(), endDate.getTime()
    );
  }

  static isValidAppointmentDate(startDate, endDate) {
    return !Utils.isHoliday(startDate, endDate) && !Utils.isDinner(startDate, endDate);
  }

  static getCellText(cell) {
    const startDate = cell.startDate;
    const endDate = cell.endDate;

    const isHoliday = this.isHoliday(startDate, endDate);
    const isDinner = this.isDinner(startDate, endDate);

    if (isHoliday) {
      return holiday.name;
    } else if (isDinner) {
      return "Dinner Time";
    }

    return cell.text;
  }
}
