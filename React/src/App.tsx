import { useCallback, useRef } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import Scheduler from 'devextreme-react/scheduler';
import notify from 'devextreme/ui/notify';
import type {
  AppointmentData,
  Holiday,
  DinnerTime,
  DataCellProps,
} from './types';

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

const views = [
  {
    type: 'timelineDay' as const,
    intervalCount: 3,
  },
];

function App(): JSX.Element {
  const schedulerRef = useRef<any>(null);

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

  const applyDisableDatesToDateEditors = useCallback((form: any): void => {
    const holidayDate = holiday.date;

    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', [holidayDate]);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', [holidayDate]);
  }, [holiday.date]);

  const onAppointmentChanging = useCallback((e: any): void => {
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
  }, [isValidAppointmentDate, notifyDisableDate]);

  const onAppointmentFormOpening = useCallback((e: any): void => {
    const startDate = new Date(e.appointmentData.startDate);
    const endDate = new Date(e.appointmentData.endDate);

    if (!isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      notifyDisableDate();
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

  const DataCellComponent = useCallback((props: any): JSX.Element => {
    // Handle different possible data structures
    const cellData = props.data || props;
    
    if (!cellData || !cellData.startDate || !cellData.endDate) {
      return <div></div>;
    }

    const { startDate, endDate } = cellData;
    const cssClasses = [];

    const isHolidayCell = isHoliday(startDate, endDate);
    const isDinnerCell = isDinner(startDate, endDate);

    if (isHolidayCell) {
      cssClasses.push('holiday');
    } else if (isDinnerCell) {
      cssClasses.push('dinner');
    }

    return (
      <div className={cssClasses.join(' ')}>
        {getCellText(cellData)}
      </div>
    );
  }, [isHoliday, isDinner, getCellText]);

  return (
    <div id="app-container">
      <Scheduler
        ref={schedulerRef}
        dataSource={data}
        views={views}
        defaultCurrentView="timelineDay"
        defaultCurrentDate={currentDate}
        height={600}
        startDayHour={9}
        endDayHour={19}
        cellDuration={60}
        dataCellComponent={DataCellComponent}
        onAppointmentFormOpening={onAppointmentFormOpening}
        onAppointmentAdding={onAppointmentChanging}
        onAppointmentUpdating={onAppointmentChanging}
      />
    </div>
  );
}

export default App;
