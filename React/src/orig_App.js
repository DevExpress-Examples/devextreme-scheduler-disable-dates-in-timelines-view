import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import './App.css';

import Scheduler from 'devextreme-react/scheduler';
import notify from 'devextreme/ui/notify';

import { data, holiday } from './data.js';
import Utils from './utils.js';
import DataCell from './DataCell.js';

const currentDate = new Date(2021, 4, 3);
const views = [
  {
    type: "timelineDay",
    intervalCount: 3
  }
];
const currentView = views[0].type;

const onAppointmentChanging = function (e) {
  const startDate = e.appointmentData
    ? new Date(e.appointmentData.startDate)
    : new Date(e.newData.startDate);

  const endDate = e.appointmentData
    ? new Date(e.appointmentData.endDate)
    : new Date(e.newData.endDate);

  if (!Utils.isValidAppointmentDate(startDate, endDate)) {
    e.cancel = true;
    notifyDisableDate();
  }
}

const onAppointmentFormOpening = function (e) {
  const startDate = new Date(e.appointmentData.startDate);
  const endDate = new Date(e.appointmentData.endDate);

  if (!Utils.isValidAppointmentDate(startDate, endDate)) {
    e.cancel = true;
    notifyDisableDate();
  }
  applyDisableDatesToDateEditors(e.form);
}

const applyDisableDatesToDateEditors = function (form) {
  const holidayDate = holiday.date;

  const startDateEditor = form.getEditor('startDate');
  startDateEditor.option('disabledDates', [holidayDate]);

  const endDateEditor = form.getEditor('endDate');
  endDateEditor.option('disabledDates', [holidayDate]);
}

const notifyDisableDate = function () {
  notify("Cannot create or move an appointment/event to disabled time/date regions.", "warning", 1000);
}

function App() {
  return (
    <Scheduler
      dataSource={data}
      views={views}
      defaultCurrentView={currentView}
      defaultCurrentDate={currentDate}
      height={600}
      startDayHour={9}
      endDayHour={19}
      cellDuration={60}
      dataCellComponent={DataCell}
      onAppointmentFormOpening={onAppointmentFormOpening}
      onAppointmentAdding={onAppointmentChanging}
      onAppointmentUpdating={onAppointmentChanging}
    />
  );
}

export default App;
