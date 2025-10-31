export interface AppointmentData {
  text: string;
  startDate: Date;
  endDate: Date;
}

export interface Holiday {
  date: Date;
  name: string;
}

export interface DinnerTime {
  start: number;
  end: number;
}

export interface SchedulerView {
  type: string;
  intervalCount: number;
}

export interface CellData {
  startDate: Date;
  endDate: Date;
  text: string;
}
