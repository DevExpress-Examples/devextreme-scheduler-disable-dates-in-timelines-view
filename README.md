# Scheduler - How to disable dates in the timeline view
This example demonstrates how to create a scheduler with disabled dates in the timeline view.

The main idea is to validate the process of adding and updating appointments with the 'onAppointmentFormOpening', 'onAppointmentAdding', and 'onAppointmentUpdating' handlers. To visually highlight cells that cannot be edited, set a function for the 'dataCellTemplate' property. This function will affect the appointment customization.
