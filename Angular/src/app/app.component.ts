import { Component } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import {
  AppointmentData,
  Holiday,
  DinnerTime,
  SchedulerView,
  DataCellTemplate,
} from './app.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dataSource: AppointmentData[] = [
    {
      text: 'Website Re-Design Plan',
      startDate: new Date(2021, 4, 5, 9, 30),
      endDate: new Date(2021, 4, 5, 11, 30),
    },
    {
      text: 'Install New Router in Dev Room',
      startDate: new Date(2021, 4, 6, 13),
      endDate: new Date(2021, 4, 6, 14),
    },
    {
      text: 'Approve Personal Computer Upgrade Plan',
      startDate: new Date(2021, 4, 3, 10),
      endDate: new Date(2021, 4, 3, 11),
    },
    {
      text: 'Final Budget Review',
      startDate: new Date(2021, 4, 5, 13, 30),
      endDate: new Date(2021, 4, 5, 15),
    },
    {
      text: 'New Brochures',
      startDate: new Date(2021, 4, 6, 15),
      endDate: new Date(2021, 4, 6, 16, 15),
    },
    {
      text: 'Install New Database',
      startDate: new Date(2021, 4, 3, 9, 45),
      endDate: new Date(2021, 4, 3, 12),
    },
    {
      text: 'Approve New Online Marketing Strategy',
      startDate: new Date(2021, 4, 3, 14, 30),
      endDate: new Date(2021, 4, 3, 16, 30),
    },
    {
      text: 'Upgrade Personal Computers',
      startDate: new Date(2021, 4, 6, 15, 30),
      endDate: new Date(2021, 4, 6, 16, 45),
    },
    {
      text: 'Prepare 2021 Marketing Plan',
      startDate: new Date(2021, 4, 3, 13),
      endDate: new Date(2021, 4, 3, 15),
    },
    {
      text: 'Brochure Design Review',
      startDate: new Date(2021, 5, 1, 15, 30),
      endDate: new Date(2021, 5, 2),
    },
    {
      text: 'Create Icons for Website',
      startDate: new Date(2021, 4, 5, 10),
      endDate: new Date(2021, 4, 5, 11),
    },
    {
      text: 'Upgrade Server Hardware',
      startDate: new Date(2021, 4, 5, 16, 30),
      endDate: new Date(2021, 4, 5, 18),
    },
    {
      text: 'Launch New Website',
      startDate: new Date(2021, 4, 5, 14, 30),
      endDate: new Date(2021, 4, 5, 16, 10),
    },
  ];

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

  onAppointmentChanging(e: any): void {
    const startDate = e.appointmentData
      ? new Date(e.appointmentData.startDate)
      : new Date(e.newData.startDate);

    const endDate = e.appointmentData
      ? new Date(e.appointmentData.endDate)
      : new Date(e.newData.endDate);

    if (!this.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  onAppointmentFormOpening(e: any): void {
    const startDate = new Date(e.appointmentData.startDate);
    const endDate = new Date(e.appointmentData.endDate);

    if (!this.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
    this.applyDisableDatesToDateEditors(e.form);
  }

  isValidAppointmentDate(startDate: Date, endDate: Date): boolean {
    return !this.isHoliday(startDate, endDate) && !this.isDinner(startDate, endDate);
  }

  applyDisableDatesToDateEditors(form: any): void {
    const holidayDate = this.holiday.date;

    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', [holidayDate]);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', [holidayDate]);
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
