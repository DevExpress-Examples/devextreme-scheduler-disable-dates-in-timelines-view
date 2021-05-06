import { Component } from '@angular/core';
import { DataService } from './app.service';

import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [DataService]
})
export class AppComponent {
  dataSource: DataSource;
  currentDate = new Date(2021, 4, 3);
  views = [
    {
      type: "timelineDay",
      intervalCount: 3
    }
  ];
  currentView = this.views[0];

  constructor(public dataService: DataService) {
    this.dataSource = new DataSource({
      store: dataService.getData()
    });
  }

  isHoliday(startDate: Date, endDate: Date) {
    const holiday = this.dataService.getHoliday();

    return holiday.date.toLocaleDateString() === startDate.toLocaleDateString() &&
      holiday.date.toLocaleDateString() === endDate.toLocaleDateString();
  };

  hasIntersection(startA: number, endA: number, startB: number, endB: number) {
    if ((startA <= startB && endB <= endA) ||
      (startB <= startA && endA <= endB)) {
      return true;
    }

    return (startA < startB && startB < endA) ||
      (startA < endB && endB < endA);
  }

  isDinner(startDate: Date, endDate: Date) {
    const dinnerTime = this.dataService.getDinnerTime();

    const todayDinnerStart = new Date(startDate).setHours(dinnerTime.start, 0, 0, 0);
    const todayDinnerEnd = new Date(endDate).setHours(dinnerTime.end, 0, 0, 0);

    return this.hasIntersection(
      todayDinnerStart, todayDinnerEnd,
      startDate.getTime(), endDate.getTime()
    );
  }

  onAppointmentChanging(e: any) {
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

  onAppointmentFormOpening(e: any) {
    const startDate = new Date(e.appointmentData.startDate);
    const endDate = new Date(e.appointmentData.endDate);

    if (!this.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      this.notifyDisableDate();
    }
    this.applyDisableDatesToDateEditors(e.form);
  }

  isValidAppointmentDate(startDate: Date, endDate: Date) {
    return !this.isHoliday(startDate, endDate) && !this.isDinner(startDate, endDate);
  }

  applyDisableDatesToDateEditors(form: any) {
    const holidayDate = this.dataService.getHoliday().date;

    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', [holidayDate]);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', [holidayDate]);
  }

  getCellText(cell: any) {
    const startDate = cell.startDate;
    const endDate = cell.endDate;

    const isHoliday = this.isHoliday(startDate, endDate);
    const isDinner = this.isDinner(startDate, endDate);

    if (isHoliday) {
      return this.dataService.getHoliday().name;
    } else if (isDinner) {
      return "Dinner Time";
    }

    return cell.text;
  }

  notifyDisableDate() {
    notify("Cannot create or move an appointment/event to disabled time/date regions.", "warning", 1000);
  }
}
