<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/369231069/20.2.6%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T999963)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
<!-- default badges end -->
# Scheduler - How to disable dates in the timeline view
This example demonstrates how to create a scheduler with disabled dates in the timeline view.

The main idea is to validate the process of adding and updating appointments with the 'onAppointmentFormOpening', 'onAppointmentAdding', and 'onAppointmentUpdating' handlers. To visually highlight cells that cannot be edited, set a function for the 'dataCellTemplate' property. This function will affect the appointment customization.
