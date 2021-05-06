$(function () {
    $("#scheduler").dxScheduler({
        dataSource: data,
        views: [
            {
                type: "timelineDay",
                intervalCount: 3
            }
        ],
        currentView: "timelineDay",
        currentDate: new Date(2021, 4, 3),
        startDayHour: 9,
        endDayHour: 19,
        cellDuration: 60,
        height: 600,

        dataCellTemplate: renderCellTemplate,
        onAppointmentFormOpening: onAppointmentFormOpening,
        onAppointmentAdding: onAppointmentChanging,
        onAppointmentUpdating: onAppointmentChanging
    });
});

var dinnerTime = { start: 12, end: 13 };

var holiday = {
    date: new Date(2021, 4, 4),
    name: 'Star Wars Day'
};

function isHoliday(startDate, endDate) {
    return holiday.date.toLocaleDateString() === startDate.toLocaleDateString() &&
        holiday.date.toLocaleDateString() === endDate.toLocaleDateString();
}

function hasIntersection(startA, endA, startB, endB) {
    if ((startA <= startB && endB <= endA) ||
        (startB <= startA && endA <= endB)) {
        return true;
    }

    return (startA < startB && startB < endA) ||
           (startA < endB && endB < endA);
}

function isDinner(startDate, endDate) {
    var todayDinnerStart = new Date(startDate).setHours(dinnerTime.start, 0, 0, 0);
    var todayDinnerEnd = new Date(endDate).setHours(dinnerTime.end, 0, 0, 0);

    return hasIntersection(
        todayDinnerStart, todayDinnerEnd,
        startDate.getTime(), endDate.getTime()
    );
}

function onAppointmentChanging(e) {
    var startDate = e.appointmentData 
        ? new Date(e.appointmentData.startDate) 
        : new Date(e.newData.startDate);

    var endDate = e.appointmentData
        ? new Date(e.appointmentData.endDate)
        : new Date(e.newData.endDate);

    if(!isValidAppointmentDate(startDate, endDate)) {
        e.cancel = true;
        notifyDisableDate();
    }
}

function onAppointmentFormOpening(e) {
    var startDate = new Date(e.appointmentData.startDate);
    var endDate = new Date(e.appointmentData.endDate);

    if(!isValidAppointmentDate(startDate, endDate)) {
        e.cancel = true;
        notifyDisableDate();
    }
    applyDisableDatesToDateEditors(e.form);
}

function renderCellTemplate(itemData, itemIndex, itemElement) {
    var startDate = itemData.startDate;
    var endDate = itemData.endDate;

    var isHolidayCell = isHoliday(startDate, endDate);
    var isDinnerCell = isDinner(startDate, endDate);

    var element = $(`<div>${getCellText(itemData)}</div>`);

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

    const isHoliday = this.isHoliday(startDate, endDate);
    const isDinner = this.isDinner(startDate, endDate);

    if (isHoliday) {
        return holiday.name;
    } else if (isDinner) {
        return "Dinner Time";
    }

    return itemData.text;
}

function isValidAppointmentDate(startDate, endDate) {
    return !isHoliday(startDate, endDate) && !isDinner(startDate, endDate);
}

function applyDisableDatesToDateEditors(form) {
    var holidayDate = holiday.date;

    var startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', [holidayDate]);

    var endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', [holidayDate]);
}

function notifyDisableDate() {
    DevExpress.ui.notify("Cannot create or move an appointment/event to disabled time/date regions.", "warning", 1000);
}

var data = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date(2021, 4, 5, 9, 30),
        endDate: new Date(2021, 4, 5, 11, 30)
    },
    {
        text: "Install New Router in Dev Room",
        startDate: new Date(2021, 4, 6, 13),
        endDate: new Date(2021, 4, 6, 14)
    },
    {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date(2021, 4, 3, 10),
        endDate: new Date(2021, 4, 3, 11)
    },
    {
        text: "Final Budget Review",
        startDate: new Date(2021, 4, 5, 13, 30),
        endDate: new Date(2021, 4, 5, 15)
    },
    {
        text: "New Brochures",
        startDate: new Date(2021, 4, 6, 15),
        endDate: new Date(2021, 4, 6, 16, 15)
    },
    {
        text: "Install New Database",
        startDate: new Date(2021, 4, 3, 9, 45),
        endDate: new Date(2021, 4, 3, 12)
    },
    {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date(2021, 4, 3, 14, 30),
        endDate: new Date(2021, 4, 3, 16, 30)
    },
    {
        text: "Upgrade Personal Computers",
        startDate: new Date(2021, 4, 6, 15, 30),
        endDate: new Date(2021, 4, 6, 16, 45)
    },
    {
        text: "Prepare 2021 Marketing Plan",
        startDate: new Date(2021, 4, 3, 13),
        endDate: new Date(2021, 4, 3, 15)
    },
    {
        text: "Brochure Design Review",
        startDate: new Date(2021, 5, 1, 15, 30),
        endDate: new Date(2021, 5, 2)
    },
    {
        text: "Create Icons for Website",
        startDate: new Date(2021, 4, 5, 10),
        endDate: new Date(2021, 4, 5, 11)
    },
    {
        text: "Upgrade Server Hardware",
        startDate: new Date(2021, 4, 5, 16, 30),
        endDate: new Date(2021, 4, 5, 18)
    },
    {
        text: "Launch New Website",
        startDate: new Date(2021, 4, 5, 14, 30),
        endDate: new Date(2021, 4, 5, 16, 10)
    }
];