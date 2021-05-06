<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :current-view="currentView"
    :height="600"
    :cellDuration="60"
    :start-day-hour="9"
    :end-day-hour="19"
    data-cell-template="dataCellTemplate"
    :on-appointment-form-opening="onAppointmentFormOpening"
    :on-appointment-adding="onAppointmentChanging"
    :on-appointment-updating="onAppointmentChanging"
  >
    <template #dataCellTemplate="{ data: cellData }">
      <DataCell :cell-data="cellData" />
    </template>
  </DxScheduler>
</template>

<script>
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
import { DxScheduler } from "devextreme-vue/scheduler";
import { data, holiday } from "./data.js";
import notify from "devextreme/ui/notify";
import Utils from "./utils.js";
import './style.css';

import DataCell from "./components/DataCell.vue";

export default {
  name: "App",
  components: {
    DxScheduler,
    DataCell,
  },
  data() {
    return {
      views: [
        {
          type: "timelineDay",
          intervalCount: 3
        }
      ],
      currentView: "timelineDay",
      currentDate: new Date(2021, 4, 3),
      dataSource: data,
    };
  },
  methods: {
    onAppointmentChanging: function (e) {
      const startDate = e.appointmentData
        ? new Date(e.appointmentData.startDate)
        : new Date(e.newData.startDate);

      const endDate = e.appointmentData
        ? new Date(e.appointmentData.endDate)
        : new Date(e.newData.endDate);

      if (!Utils.isValidAppointmentDate(startDate, endDate)) {
        e.cancel = true;
        this.notifyDisableDate();
      }
    },

    applyDisableDatesToDateEditors: function (form) {
      const holidayDate = holiday.date;

      const startDateEditor = form.getEditor("startDate");
      startDateEditor.option("disabledDates", [holidayDate]);

      const endDateEditor = form.getEditor("endDate");
      endDateEditor.option("disabledDates", [holidayDate]);
    },

    notifyDisableDate: function () {
      notify(
        "Cannot create or move an appointment/event to disabled time/date regions.",
        "warning",
        1000
      );
    },

    onAppointmentFormOpening: function (e) {
      const startDate = new Date(e.appointmentData.startDate);
      const endDate = new Date(e.appointmentData.endDate);

      if (!Utils.isValidAppointmentDate(startDate, endDate)) {
        e.cancel = true;
        this.notifyDisableDate();
      }
      this.applyDisableDatesToDateEditors(e.form);
    },
  },
};
</script>
