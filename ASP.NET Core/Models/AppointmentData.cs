using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models
{
    static class AppointmentData
    {
        public static List<Appoinment> Appointments = new List<Appoinment>()
        {
            new Appoinment
            {
                OrderID = 1,
                Text = "Website Re-Design Plan",
                StartDate = new DateTime(2021, 5, 5, 9, 30, 0),
                EndDate = new DateTime(2021, 5, 5, 11, 30, 0)
            },
            new Appoinment
            {
                OrderID = 2,
                Text = "Install New Router in Dev Room",
                StartDate = new DateTime(2021, 5, 6, 13, 0, 0),
                EndDate = new DateTime(2021, 5, 6, 14, 0, 0)
            },
            new Appoinment
            {
                OrderID = 3,
                Text = "Approve Personal Computer Upgrade Plan",
                StartDate = new DateTime(2021, 5, 3, 10, 0, 0),
                EndDate = new DateTime(2021, 5, 3, 11, 0, 0)
            },
            new Appoinment
            {
                OrderID = 4,
                Text = "Final Budget Review",
                StartDate = new DateTime(2021, 5, 5, 13, 30, 0),
                EndDate = new DateTime(2021, 5, 5, 15, 0, 0)
            },
            new Appoinment
            {
                OrderID = 5,
                Text = "New Brochures",
                StartDate = new DateTime(2021, 5, 6, 15, 0, 0),
                EndDate = new DateTime(2021, 5, 6, 16, 15, 0, 0)
            },
            new Appoinment
            {
                OrderID = 6,
                Text = "Install New Database",
                StartDate = new DateTime(2021, 5, 3, 9, 45, 0),
                EndDate = new DateTime(2021, 5, 3, 12, 0, 0)
            },
            new Appoinment
            {
                OrderID = 7,
                Text = "Approve New Online Marketing Strategy",
                StartDate = new DateTime(2021, 5, 3, 14, 30, 0),
                EndDate = new DateTime(2021, 5, 3, 16, 30, 0)
            },
            new Appoinment
            {
                OrderID = 8,
                Text = "Upgrade Personal Computers",
                StartDate = new DateTime(2021, 5, 6, 15, 30, 0),
                EndDate = new DateTime(2021, 5, 6, 16, 45, 0)
            },
            new Appoinment
            {
                OrderID = 9,
                Text = "Prepare 2021 Marketing Plan",
                StartDate = new DateTime(2021, 5, 3, 13, 0, 0),
                EndDate = new DateTime(2021, 5, 3, 15, 0, 0)
            },
            new Appoinment
            {
                OrderID = 10,
                Text = "Brochure Design Review",
                StartDate = new DateTime(2021, 5, 1, 15, 30, 0),
                EndDate = new DateTime(2021, 5, 2, 0, 0, 0)
            },
            new Appoinment
            {
                OrderID = 11,
                Text = "Create Icons for Website",
                StartDate = new DateTime(2021, 5, 5, 10, 0, 0),
                EndDate = new DateTime(2021, 5, 5, 11, 0, 0)
            },
            new Appoinment
            {
                OrderID = 12,
                Text = "Upgrade Server Hardware",
                StartDate = new DateTime(2021, 5, 5, 16, 30, 0),
                EndDate = new DateTime(2021, 5, 5, 18, 0, 0)
            },
            new Appoinment
            {
                OrderID = 13,
                Text = "Launch New Website",
                StartDate = new DateTime(2021, 5, 5, 14, 30, 0),
                EndDate = new DateTime(2021, 5, 5, 16, 10, 0)
            }
        };
    }
}
