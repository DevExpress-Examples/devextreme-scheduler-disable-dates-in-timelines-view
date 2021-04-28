import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import './App.css';

import Scheduler from 'devextreme-react/scheduler';
import notify from 'devextreme/ui/notify';

import { data, holidays } from './data.js';
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

function App() {
  const onAppointmentChanging = function (e) {
    var startDate = e.appointmentData ? new Date(e.appointmentData.startDate)
      : new Date(e.newData.startDate);

    var endDate = e.appointmentData ? new Date(e.appointmentData.endDate)
      : new Date(e.newData.endDate);

    if (!Utils.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      notifyDisableDate();
    }
  }

  const onAppointmentFormOpening = function (e) {
    var startDate = new Date(e.appointmentData.startDate);
    var endDate = new Date(e.appointmentData.endDate);

    if (!Utils.isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      notifyDisableDate();
    }
    applyDisableDatesToDateEditors(e.form);
  }

  const applyDisableDatesToDateEditors = function (form) {
    var holidaysList = [];
    for (let i = 0; i < holidays.length; i++) {
      holidaysList.push(holidays[i].date);
    }

    var startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', holidaysList);

    var endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', holidaysList);
  }

  const notifyDisableDate = function () {
    notify("Cannot create or move an appointment/event to disabled time/date regions.", "warning", 1000);
  }

  const renderDataCell = function (itemData) {
    return <DataCell itemData={itemData} />;
  }

  return (
    <Scheduler
      dataSource={data}
      views={views}
      defaultCurrentView={currentView}
      defaultCurrentDate={currentDate}
      height={600}
      showAllDayPanel={false}
      firstDayOfWeek={1}
      startDayHour={9}
      endDayHour={19}
      cellDuration={60}
      dataCellRender={renderDataCell}
      onAppointmentFormOpening={onAppointmentFormOpening}
      onAppointmentAdding={onAppointmentChanging}
      onAppointmentUpdating={onAppointmentChanging}
    />
  );
}

export default App;
