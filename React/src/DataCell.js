import React, {useMemo} from 'react';
import Utils from './utils.js';

function getClasses(startDate, endDate) {
  const result = [];

  const isHoliday = Utils.isHoliday(startDate, endDate);
  const isDinner = Utils.isDinner(startDate, endDate);

  if(isHoliday) {
    result.push('holiday');
  } else if(isDinner) {
    result.push('dinner');
  }

  return result
}

export default function DataCell(props) {
  const { startDate, endDate } = props.data;
  const cssClasses = useMemo(() => getClasses(startDate, endDate), [startDate, endDate]);

  return (
    <div className={cssClasses}>
      { Utils.getCellText(props.data) }
    </div>
  );
}
