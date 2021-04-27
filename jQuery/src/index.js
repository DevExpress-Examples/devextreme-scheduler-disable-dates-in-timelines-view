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
        firstDayOfWeek: 1,
        startDayHour: 9,
        endDayHour: 19,
        cellDuration: 60,
        showAllDayPanel: false,
        height: 600,

        dataCellTemplate: function(itemData, itemIndex, itemElement) {
            var startDate = itemData.startDate;
            var endDate = itemData.endDate;

            var isHolidayCell = isHoliday(startDate, endDate);
            var isDinnerCell = isDinner(startDate, endDate);

            if (isHolidayCell) {
                return getHolidayCell(startDate, endDate);
            } else if (isDinnerCell) {
                return getDinnerCell();
            }

            return itemElement;
        },

        onAppointmentFormOpening: function(e) {
            var startDate = new Date(e.appointmentData.startDate);
            var endDate = new Date(e.appointmentData.endDate);
            if(!isValidAppointmentDate(startDate, endDate)) {
                e.cancel = true;
                notifyDisableDate();
            }
            applyDisableDatesToDateEditors(e.form);
        },

        onAppointmentAdding: function(e) {
            debugger
            if(!isValidAppointment(e.component, e.appointmentData)) {
                e.cancel = true;
                notifyDisableDate();
            }
        },

        onAppointmentUpdating: function(e) {
            if(!isValidAppointment(e.component, e.newData)) {
                e.cancel = true;
                notifyDisableDate();
            }
        }
    });
});

var dinnerTime = { start: 12, end: 13 };
var holidays = [
    {
        date: new Date(2021, 4, 4),
        name: 'Star Wars Day'
    }
];

function isThatHoliday(holiday, startDate, endDate) {
    return holiday.date.toLocaleDateString() === startDate.toLocaleDateString() &&
           holiday.date.toLocaleDateString() === endDate.toLocaleDateString();
}

function isHoliday(starDate, endDate) {
    return holidays.some(function(holiday) {
        return isThatHoliday(holiday, starDate, endDate);
    });
}

function isDinner(startDate, endDate) {
    return startDate.getDate() === endDate.getDate() &&
           startDate.getHours() >= dinnerTime.start &&
           endDate.getHours() <= dinnerTime.end;
}

function getHolidayCell(startDate, endDate) {
    for (let i = 0; i < holidays.length; i++) {
        if (isThatHoliday(holidays[i], startDate, endDate)) {
            var element = $('<div>' + holidays[i].name + '</div>');
            element.addClass('holiday');

            return element;
        }
    }
}

function getDinnerCell() {
    var element = $('<div>Dinner time</div>');
    element.addClass('dinner');

    return element;
}

function notifyDisableDate() {
    DevExpress.ui.notify("Cannot create or move an appointment/event to disabled time/date regions.", "warning", 1000);
}

function isValidAppointment(component, appointmentData) {
    var startDate = new Date(appointmentData.startDate);
    var endDate = new Date(appointmentData.endDate);

    var cellDuration = component.option('cellDuration');
    return isValidAppointmentInterval(startDate, endDate, cellDuration);
}

function isValidAppointmentInterval(startDate, endDate, cellDuration) {
    var edgeEndDate = new Date(endDate.getTime() - 1);

    if (!isValidAppointmentDate(edgeEndDate)) {
        return false;
    }

    var durationInMs = cellDuration * 60 * 1000;
    var date = startDate;
    while (date <= endDate) {
        if (!isValidAppointmentDate(date)) {
            return false;
        }
        var newDateTime = date.getTime() + durationInMs - 1;
        date.setTime(newDateTime);
    }

    return true;
}

function isValidAppointmentDate(startDate, endDate) {
    return !isHoliday(startDate, endDate) && !isDinner(startDate, endDate);
}

function applyDisableDatesToDateEditors(form) {
    var holidaysList = [];
    for (let i = 0; i < holidays.length; i++) {
        holidaysList.push(holidays[i].date);
    } 

    var startDateEditor = form.getEditor('startDate');
    startDateEditor.option('disabledDates', holidaysList);

    var endDateEditor = form.getEditor('endDate');
    endDateEditor.option('disabledDates', holidaysList);
}
