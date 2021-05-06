<template>
  <div :class="markDataCell(cellData)">
    {{ getCellText(cellData) }}
  </div>
</template>
<script>
import Utils from ".././utils.js";

export default {
  props: {
    cellData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    markDataCell(cellData) {
      const startDate = cellData.startDate;
      const endDate = cellData.endDate;

      const isHoliday = Utils.isHoliday(startDate, endDate);
      const isDinner = Utils.isDinner(startDate, endDate);

      return {
        holiday: isHoliday,
        dinner: isDinner,
      };
    },
    getCellText({ startDate, endDate, text }) {
      const isHoliday = Utils.isHoliday(startDate, endDate);
      const isDinner = Utils.isDinner(startDate, endDate);

      if (isHoliday) {
        return Utils.getHoliday().name;
      } else if (isDinner) {
        return "Dinner Time";
      }

      return text;
    }
  }
};
</script>
