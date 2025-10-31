using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ASP_NET_Core.Models;

namespace ASP_NET_Core.Controllers
{
    public class SchedulerController : Controller
    {
        public IActionResult Index()
        {
            return View(AppointmentData.Appointments);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() {
            return View();
        }
    }
}
