<script setup lang="ts">
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { DxScheduler } from 'devextreme-vue/scheduler';
import notify from 'devextreme/ui/notify';
import type dxForm from 'devextreme/ui/form';
import type {
  AppointmentAddingEvent,
  AppointmentUpdatingEvent,
  AppointmentFormOpeningEvent,
} from 'devextreme/ui/scheduler_types';
import type { Holiday, DinnerTime, SchedulerView, CellData } from '../types';
import { appointments } from '../data';

const views: SchedulerView[] = [
  {
    type: 'timelineDay',
    intervalCount: 3,
  },
];

const currentView = 'timelineDay';
const currentDate = new Date(2021, 4, 3);

const dinnerTime: DinnerTime = { start: 12, end: 13 };

const holiday: Holiday = {
  date: new Date(2021, 4, 4),
  name: 'Star Wars Day',
};

function isHoliday(startDate: Date, endDate: Date): boolean {
  return (
    holiday.date.toLocaleDateString() === startDate.toLocaleDateString()
    && holiday.date.toLocaleDateString() === endDate.toLocaleDateString()
  );
}

function hasIntersection(startA: number, endA: number, startB: number, endB: number): boolean {
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

function isDinner(startDate: Date, endDate: Date): boolean {
  const dinnerStart = new Date(startDate);
  dinnerStart.setHours(dinnerTime.start, 0, 0, 0);
  const todayDinnerStart = dinnerStart.getTime();

  const dinnerEnd = new Date(endDate);
  dinnerEnd.setHours(dinnerTime.end, 0, 0, 0);
  const todayDinnerEnd = dinnerEnd.getTime();

  return hasIntersection(
    todayDinnerStart,
    todayDinnerEnd,
    startDate.getTime(),
    endDate.getTime(),
  );
}

function isValidAppointmentDate(startDate: Date, endDate: Date): boolean {
  return !isHoliday(startDate, endDate) && !isDinner(startDate, endDate);
}

function notifyDisableDate(): void {
  notify(
    'Cannot create or move an appointment/event to disabled time/date regions.',
    'warning',
    2000,
  );
}

function applyDisableDatesToDateEditors(form: dxForm): void {
  const holidayDate = holiday.date;

  const startDateEditor = form.getEditor('startDate');
  if (startDateEditor) {
    startDateEditor.option('disabledDates', [holidayDate]);
  }

  const endDateEditor = form.getEditor('endDate');
  if (endDateEditor) {
    endDateEditor.option('disabledDates', [holidayDate]);
  }
}

function onAppointmentAdding(e: AppointmentAddingEvent): void {
  const appointmentStartDate = e.appointmentData.startDate;
  const appointmentEndDate = e.appointmentData.endDate;

  if (!appointmentStartDate || !appointmentEndDate) {
    return;
  }

  const startDate = new Date(appointmentStartDate);
  const endDate = new Date(appointmentEndDate);

  if (!isValidAppointmentDate(startDate, endDate)) {
    e.cancel = true;
    notifyDisableDate();
  }
}

function onAppointmentUpdating(e: AppointmentUpdatingEvent): void {
  const startDate = new Date(e.newData.startDate);
  const endDate = new Date(e.newData.endDate);

  if (!isValidAppointmentDate(startDate, endDate)) {
    e.cancel = true;
    notifyDisableDate();
  }
}

function onAppointmentFormOpening(e: AppointmentFormOpeningEvent): void {
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

  if (!isValidAppointmentDate(startDate, endDate)) {
    e.cancel = true;
    notifyDisableDate();
    return;
  }
  applyDisableDatesToDateEditors(e.form);
}

function getCellText(cellData: CellData): string {
  if (!cellData) {
    return '';
  }

  const startDate = cellData.startDate;
  const endDate = cellData.endDate;

  const isHolidayCell = isHoliday(startDate, endDate);
  const isDinnerCell = isDinner(startDate, endDate);

  if (isHolidayCell) {
    return holiday.name;
  }
  if (isDinnerCell) {
    return 'Dinner Time';
  }

  return cellData.text || '';
}

function markDataCell(cellData: CellData): Record<string, boolean> {
  if (!cellData || !cellData.startDate || !cellData.endDate) {
    return {};
  }

  const startDate = cellData.startDate;
  const endDate = cellData.endDate;

  const isHolidayCell = isHoliday(startDate, endDate);
  const isDinnerCell = isDinner(startDate, endDate);

  return {
    holiday: isHolidayCell,
    dinner: isDinnerCell,
  };
}
</script>

<template>
  <div id="app-container">
    <DxScheduler
      :data-source="appointments"
      :current-date="currentDate"
      :views="views"
      :current-view="currentView"
      :height="600"
      :cell-duration="60"
      :start-day-hour="9"
      :end-day-hour="19"
      data-cell-template="dataCellTemplate"
      :on-appointment-form-opening="onAppointmentFormOpening"
      :on-appointment-adding="onAppointmentAdding"
      :on-appointment-updating="onAppointmentUpdating"
    >
      <template #dataCellTemplate="{ data: cellData }">
        <div :class="markDataCell(cellData)">
          {{ getCellText(cellData) }}
        </div>
      </template>
    </DxScheduler>
  </div>
</template>

<style scoped>
#app-container {
  position: relative;
  width: 900px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
}

.holiday,
.dinner {
  height: 100%;
  width: 100%;
  z-index: 1;
  font-size: xx-large;
  font-weight: 600;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: white;
  text-align: center;
}

.dinner {
  background-image: repeating-linear-gradient(
    65deg,
    rgb(170 147 19 / 30%),
    rgb(170 147 19 / 30%) 4px,
    transparent 4px,
    transparent 9px
  );
}

.holiday {
  background-image: repeating-linear-gradient(
    135deg,
    rgb(244 67 54 / 10%),
    rgb(244 67 54 / 10%) 4px,
    transparent 4px,
    transparent 9px
  );
}
</style>

