<script setup lang="ts">
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { DxScheduler } from 'devextreme-vue/scheduler';
import notify from 'devextreme/ui/notify';
import type { AppointmentData, Holiday, DinnerTime, SchedulerView, CellData } from '../types';

const data: AppointmentData[] = [
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

function applyDisableDatesToDateEditors(form: any): void {
  const holidayDate = holiday.date;

  const startDateEditor = form.getEditor('startDate');
  startDateEditor.option('disabledDates', [holidayDate]);

  const endDateEditor = form.getEditor('endDate');
  endDateEditor.option('disabledDates', [holidayDate]);
}

function onAppointmentChanging(e: any): void {
  const startDate = e.appointmentData
    ? new Date(e.appointmentData.startDate)
    : new Date(e.newData.startDate);

  const endDate = e.appointmentData
    ? new Date(e.appointmentData.endDate)
    : new Date(e.newData.endDate);

  if (!isValidAppointmentDate(startDate, endDate)) {
    e.cancel = true;
    notifyDisableDate();
  }
}

function onAppointmentFormOpening(e: any): void {
  const startDate = new Date(e.appointmentData.startDate);
  const endDate = new Date(e.appointmentData.endDate);

  if (!isValidAppointmentDate(startDate, endDate)) {
    e.cancel = true;
    notifyDisableDate();
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
      :data-source="data"
      :current-date="currentDate"
      :views="views"
      :current-view="currentView"
      :height="600"
      :cell-duration="60"
      :start-day-hour="9"
      :end-day-hour="19"
      data-cell-template="dataCellTemplate"
      :on-appointment-form-opening="onAppointmentFormOpening"
      :on-appointment-adding="onAppointmentChanging"
      :on-appointment-updating="onAppointmentChanging"
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

