import type { DataCellProps } from './types';

interface DataCellComponentProps {
  data: DataCellProps;
  isHoliday: (startDate: Date, endDate: Date) => boolean;
  isDinner: (startDate: Date, endDate: Date) => boolean;
  getCellText: (cell: DataCellProps) => string;
}

export default function DataCellComponent({
  data,
  isHoliday,
  isDinner,
  getCellText,
}: DataCellComponentProps): JSX.Element {
  // Handle different possible data structures
  const cellData = data;

  if (!cellData?.startDate || !cellData?.endDate) {
    return <div></div>;
  }

  const { startDate, endDate } = cellData;
  const cssClasses = [];

  const isHolidayCell = isHoliday(startDate, endDate);
  const isDinnerCell = isDinner(startDate, endDate);

  if (isHolidayCell) {
    cssClasses.push('holiday');
  } else if (isDinnerCell) {
    cssClasses.push('dinner');
  }

  return (
    <div className={cssClasses.join(' ')}>
      {getCellText(cellData)}
    </div>
  );
}
