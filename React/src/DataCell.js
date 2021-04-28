import React from 'react';
import Utils from './utils.js';

export default function DataCell(props) {
  const { startDate, endDate } = props.itemData;
  const isHoliday = Utils.isHoliday(startDate, endDate);
  const isDinner = Utils.isDinner(startDate, endDate);
  const cssClasses = [];

  if(isHoliday) {
    cssClasses.push('holiday');
  } else if(isDinner) {
    cssClasses.push('dinner');
  }

  return (
    <div className={cssClasses}>
      { Utils.getCellName(props.itemData) }
    </div>
  );
}
