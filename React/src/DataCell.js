import React from 'react';
import Utils from './utils.js';

export default function DataCell(props) {
  const { startDate, endDate } = props.itemData;
  const isHoliday = Utils.isHoliday(startDate, endDate);
  const isDinner = Utils.isDinner(startDate, endDate);
  const cssClasses = [];
  let text;

  if(isHoliday) {
    cssClasses.push('holiday');
    text = Utils.getHoliday(startDate, endDate).name;
  } else if(isDinner) {
    cssClasses.push('dinner');
    text = 'Dinner Time';
  }

  return (
    <div className={cssClasses}>
      {text}
    </div>
  );
}
