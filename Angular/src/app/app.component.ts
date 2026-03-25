import { Component } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import dxForm from 'devextreme/ui/form';
import {
  AppointmentData,
  Holiday,
  DinnerTime,
  SchedulerView,
  DataCellTemplate,
} from './app.types';
import { appointments } from './app.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  dataSource: AppointmentData[] = appointments;

  currentDate: Date = new Date(2021, 4, 3);

  views: SchedulerView[] = [
    {
      type: 'timelineDay',
      intervalCount: 3,
    },
  ];

  currentView = 'timelineDay';

  startDayHour = 9;

  endDayHour = 19;

  cellDuration = 60;

  height = 600;

  private readonly dinnerTime: DinnerTime = { start: 12, end: 13 };

  private readonly holiday: Holiday = {
    date: new Date(2021, 4, 4),
    name: 'Star Wars Day',
  };

  isHoliday(startDate: Date, endDate: Date): boolean {
    return (
      this.holiday.date.toLocaleDateString() === startDate.toLocaleDateString()
      && this.holiday.date.toLocaleDateString() === endDate.toLocaleDateString()
    );
  }

  hasIntersection(startA: number, endA: number, startB: number, endB: number): boolean {
    if (
      (startA <= startB && endB <= endA)
      || (startB <= startA && endA <= endB)
    ) {
      return true;
    }

    return (
      (startA < startB && startB < endA)
      || (startA < endB && endB < endA)
    );
  }

  isDinner(startDate: Date, endDate: Date): boolean {
    const todayDinnerStart = new Date(startDate).setHours(this.dinnerTime.start, 0, 0, 0);
    const todayDinnerEnd = new Date(endDate).setHours(this.dinnerTime.end, 0, 0, 0);

    return this.hasIntersection(
      todayDinnerStart,
      todayDinnerEnd,
      startDate.getTime(),
      endDate.getTime(),
    );
  }

  onAppointmentAdding(e: DxSchedulerTypes.AppointmentAddingEvent): void {
    const appointmentStartDate = e.appointmentData.startDate;
    const appointmentEndDate = e.appointmentData.endDate;

    if (!appointmentStartDate || !appointmentEndDate) {
      return;
    }

    const startDate = new Date(appointmentStartDate);
    const endDate = new Date(appointmentEndDate);

    if (!this.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  onAppointmentUpdating(e: DxSchedulerTypes.AppointmentUpdatingEvent): void {
    const startDate = new Date(e.newData.startDate);
    const endDate = new Date(e.newData.endDate);

    if (!this.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  onAppointmentFormOpening(e: DxSchedulerTypes.AppointmentFormOpeningEvent): void {
    if (!e.appointmentData) {
      return;
    }

    const appointmentStartDate = e.appointmentData.startDate;
    const appointmentEndDate = e.appointmentData.endDate;

    if (!appointmentStartDate || !appointmentEndDate) {
      return;
    }

    const startDate = new Date(appointmentStartDate);
    const endDate = new Date(appointmentEndDate);

    if (!this.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      this.notifyDisableDate();
      return;
    }
    this.applyDisableDatesToDateEditors(e.form);
  }

  isValidAppointmentDate(startDate: Date, endDate: Date): boolean {
    return !this.isHoliday(startDate, endDate) && !this.isDinner(startDate, endDate);
  }

  applyDisableDatesToDateEditors(form: dxForm): void {
    const holidayDate = this.holiday.date;

    const startDateEditor = form.getEditor('startDate');
    if (startDateEditor) {
      startDateEditor.option('disabledDates', [holidayDate]);
    }

    const endDateEditor = form.getEditor('endDate');
    if (endDateEditor) {
      endDateEditor.option('disabledDates', [holidayDate]);
    }
  }

  getCellText(cell: DataCellTemplate): string {
    const startDate = cell.startDate;
    const endDate = cell.endDate;

    const isHolidayCell = this.isHoliday(startDate, endDate);
    const isDinnerCell = this.isDinner(startDate, endDate);

    if (isHolidayCell) {
      return this.holiday.name;
    }
    if (isDinnerCell) {
      return 'Dinner Time';
    }

    return cell.text;
  }

  notifyDisableDate(): void {
    notify(
      'Cannot create or move an appointment/event to disabled time/date regions.',
      'warning',
      2000,
    );
  }
}
