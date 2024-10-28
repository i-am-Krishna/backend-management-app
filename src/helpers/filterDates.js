// Constants for date filters
const DATES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

const getDateFilterRange = (filterBy) => {
  const currentDate = new Date();
  let startDate, endDate = new Date(currentDate); // End at current date's end time

  switch (filterBy) {
    case DATES.WEEK:
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 6); // 7 days including today
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case DATES.MONTH:
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 29); // 30 days including today
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    case DATES.YEAR:
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 364); // 365 days including today
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;

    default:
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 6); // 7 days including today
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
};

module.exports = { getDateFilterRange };
