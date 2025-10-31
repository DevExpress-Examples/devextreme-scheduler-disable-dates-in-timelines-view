$(() => {
  const data = [
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

  const dinnerTime = { start: 12, end: 13 };

  const holiday = {
    date: new Date(2021, 4, 4),
    name: 'Star Wars Day',
  };

  function isHoliday(startDate, endDate) {
    return (
      holiday.date.toLocaleDateString() === startDate.toLocaleDateString()
      && holiday.date.toLocaleDateString() === endDate.toLocaleDateString()
    );
  }

  function hasIntersection(startA, endA, startB, endB) {
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

  function isDinner(startDate, endDate) {
    const todayDinnerStart = new Date(startDate).setHours(
      dinnerTime.start,
      0,
      0,
      0,
    );
    const todayDinnerEnd = new Date(endDate).setHours(dinnerTime.end, 0, 0, 0);

    return hasIntersection(
      todayDinnerStart,
      todayDinnerEnd,
      startDate.getTime(),
      endDate.getTime(),
    );
  }

  function onAppointmentChanging(e) {
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

  function onAppointmentFormOpening(e) {
    const startDate = new Date(e.appointmentData.startDate);
    const endDate = new Date(e.appointmentData.endDate);

    if (!isValidAppointmentDate(startDate, endDate)) {
      e.cancel = true;
      notifyDisableDate();
    }
    applyDisableDatesToDateEditors(e.form);
  }

  function renderCellTemplate(itemData, itemIndex, itemElement) {
    const startDate = itemData.startDate;
    const endDate = itemData.endDate;

    const isHolidayCell = isHoliday(startDate, endDate);
    const isDinnerCell = isDinner(startDate, endDate);

    const element = $(`<div>${getCellText(itemData)}</div>`);

    if (isHolidayCell) {
      element.addClass('holiday');
    }

    if (isDinnerCell) {
      element.addClass('dinner');
    }

    return itemElement.append(element);
  }

  function getCellText(itemData) {
    const startDate = itemData.startDate;
    const endDate = itemData.endDate;

    const isHolidayCell = isHoliday(startDate, endDate);
    const isDinnerCell = isDinner(startDate, endDate);

    if (isHolidayCell) {
      return holiday.name;
    }
    if (isDinnerCell) {
      return 'Dinner Time';
    }

    return itemData.text;
  }

  function isValidAppointmentDate(startDate, endDate) {
    return !isHoliday(startDate, endDate) && !isDinner(startDate, endDate);
  }

  function applyDisableDatesToDateEditors(form) {
    const holidayDate = holiday.date;

    const startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', [holidayDate]);

    const endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', [holidayDate]);
  }

  function notifyDisableDate() {
    DevExpress.ui.notify(
      'Cannot create or move an appointment/event to disabled time/date regions.',
      'warning',
      2000,
    );
  }

  const scheduler = $('#scheduler')
    .dxScheduler({
      dataSource: data,
      views: [
        {
          type: 'timelineDay',
          intervalCount: 3,
        },
      ],
      currentView: 'timelineDay',
      currentDate: new Date(2021, 4, 3),
      startDayHour: 9,
      endDayHour: 19,
      cellDuration: 60,
      height: 600,
      dataCellTemplate: renderCellTemplate,
      onAppointmentFormOpening,
      onAppointmentAdding: onAppointmentChanging,
      onAppointmentUpdating: onAppointmentChanging,
    })
    .dxScheduler('instance');
});
