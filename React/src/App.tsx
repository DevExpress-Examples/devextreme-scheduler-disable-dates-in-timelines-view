import { useCallback, useRef } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import Scheduler from 'devextreme-react/scheduler';
import notify from 'devextreme/ui/notify';
import type { SchedulerTypes } from 'devextreme-react/scheduler';
import type dxForm from 'devextreme/ui/form';
import type {
  Holiday,
  DinnerTime,
  DataCellProps,
} from './types';
import { appointments } from './data';
import DataCellComponent from './DataCellComponent';

const views = [
  {
    type: 'timelineDay' as const,
    intervalCount: 3,
  },
];

function App(): JSX.Element {
  const schedulerRef = useRef(null);

  const dinnerTime: DinnerTime = { start: 12, end: 13 };

  const holiday: Holiday = {
    date: new Date(2021, 4, 4),
    name: 'Star Wars Day',
  };

  const currentDate = new Date(2021, 4, 3);

  const isHoliday = useCallback(
    (startDate: Date, endDate: Date): boolean => holiday.date.toLocaleDateString() === startDate.toLocaleDateString()
    && holiday.date.toLocaleDateString() === endDate.toLocaleDateString()
    , [holiday.date],
  );

  const hasIntersection = useCallback((startA: number, endA: number, startB: number, endB: number): boolean => {
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
  }, []);

  const isDinner = useCallback((startDate: Date, endDate: Date): boolean => {
    const todayDinnerStart = new Date(startDate).setHours(dinnerTime.start, 0, 0, 0);
    const todayDinnerEnd = new Date(endDate).setHours(dinnerTime.end, 0, 0, 0);

    return hasIntersection(
      todayDinnerStart,
      todayDinnerEnd,
      startDate.getTime(),
      endDate.getTime(),
    );
  }, [dinnerTime.start, dinnerTime.end, hasIntersection]);

  const isValidAppointmentDate = useCallback(
    (startDate: Date, endDate: Date): boolean => !isHoliday(startDate, endDate) && !isDinner(startDate, endDate)
    , [isHoliday, isDinner],
  );

  const notifyDisableDate = useCallback((): void => {
    notify(
      'Cannot create or move an appointment/event to disabled time/date regions.',
      'warning',
      2000,
    );
  }, []);

  const applyDisableDatesToDateEditors = useCallback((form: dxForm): void => {
    const holidayDate = holiday.date;

    const startDateEditor = form.getEditor('startDate');
    if (startDateEditor) {
      startDateEditor.option('disabledDates', [holidayDate]);
    }

    const endDateEditor = form.getEditor('endDate');
    if (endDateEditor) {
      endDateEditor.option('disabledDates', [holidayDate]);
    }
  }, [holiday.date]);

  const onAppointmentAdding = useCallback((e: SchedulerTypes.AppointmentAddingEvent): void => {
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
  }, [isValidAppointmentDate, notifyDisableDate]);

  const onAppointmentUpdating = useCallback((e: SchedulerTypes.AppointmentUpdatingEvent): void => {
    const startDate = new Date(e.newData.startDate);
    const endDate = new Date(e.newData.endDate);

    if (!isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      notifyDisableDate();
    }
  }, [isValidAppointmentDate, notifyDisableDate]);

  const onAppointmentFormOpening = useCallback((e: SchedulerTypes.AppointmentFormOpeningEvent): void => {
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
  }, [isValidAppointmentDate, notifyDisableDate, applyDisableDatesToDateEditors]);

  const getCellText = useCallback((cell: DataCellProps): string => {
    if (!cell) {
      return '';
    }

    const startDate = cell.startDate;
    const endDate = cell.endDate;

    const isHolidayCell = isHoliday(startDate, endDate);
    const isDinnerCell = isDinner(startDate, endDate);

    if (isHolidayCell) {
      return holiday.name;
    }
    if (isDinnerCell) {
      return 'Dinner Time';
    }

    return cell.text || '';
  }, [isHoliday, isDinner, holiday.name]);

  const dataCellRender = useCallback((data: DataCellProps) => (
    <DataCellComponent
      data={data}
      isHoliday={isHoliday}
      isDinner={isDinner}
      getCellText={getCellText}
    />
  ), [isHoliday, isDinner, getCellText]);

  return (
    <div id="app-container">
      <Scheduler
        ref={schedulerRef}
        dataSource={appointments}
        views={views}
        defaultCurrentView="timelineDay"
        defaultCurrentDate={currentDate}
        height={600}
        startDayHour={9}
        endDayHour={19}
        cellDuration={60}
        dataCellRender={dataCellRender}
        onAppointmentFormOpening={onAppointmentFormOpening}
        onAppointmentAdding={onAppointmentAdding}
        onAppointmentUpdating={onAppointmentUpdating}
      />
    </div>
  );
}

export default App;
