<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/369231069/20.2.6%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T999963)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->

# Scheduler for DevExtreme - How to disable dates in the timeline view

This example demonstrates how to create a scheduler with disabled dates in the timeline view.

The main idea is to validate the process of adding and updating appointments with the `onAppointmentFormOpening`, `onAppointmentAdding`, and `onAppointmentUpdating` handlers. To visually highlight cells that cannot be edited, set a function for the `dataCellTemplate` property. This function will affect the appointment customization.

<div align="center"><img alt="Scheduler for DevExtreme - How to disable dates in the timeline view" src="dx-scheduler-disable-dates-in-timelines-view.png" /></div>

## Files to Review

- **Angular**
    - [app.component.html](Angular/src/app/app.component.html)
    - [app.component.ts](Angular/src/app/app.component.ts)
- **jQuery**
    - [index.html](jQuery/src/index.html)
    - [index.js](jQuery/src/index.js)
- **React**
    - [App.js](React/src/App.js)
- **Vue**
    - [App.vue](Vue/src/App.vue)
- **ASP.NET Core**    
    - [Index.cshtml](ASP.NET%20Core/Views/Scheduler/Index.cshtml)

## Documentation

- [Getting Started with Scheduler](https://js.devexpress.com/Documentation/Guide/UI_Components/Scheduler/Getting_Started_with_Scheduler/)

- [Scheduler - API Reference](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxScheduler/)
<!-- feedback -->
## Does this example address your development requirements/objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-scheduler-disable-dates-in-timelines-view&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-scheduler-disable-dates-in-timelines-view&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->
