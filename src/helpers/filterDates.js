// Constants for date filters
const DATES = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

/**
 * Gets the start and end dates based on the specified filter.
 * @param {string} filterBy - The filter type to determine the date range.
 * @returns {Object} - An object containing the startDate and endDate.
 */
const getDateFilterRange = (filterBy) => {
    // Get the current date
    const currentDate = new Date();
    let startDate, endDate;
  
    // Determine the date range based on the filter type
    switch (filterBy) {
      case DATES.TODAY:
        // Set start and end for today
        startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        endDate = new Date(currentDate.setHours(23, 59, 59, 999));
        break;
      case DATES.WEEK:
        // Calculate the start of the week (Sunday) and set the end to the following Saturday
        const startOfWeek = currentDate.getDate() - currentDate.getDay();
        startDate = new Date(currentDate.setDate(startOfWeek));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case DATES.MONTH:
        // Get the first and last date of the current month
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case DATES.YEAR:
        // Get the first and last date of the current year
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        // Fallback to today if the filter type is unrecognized
        startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        endDate = new Date(currentDate.setHours(23, 59, 59, 999));
        break;
    }
  
    // Return the start and end dates as an object
    return { startDate, endDate };
};

// Exporting the function for use in other parts of the application
module.exports = { getDateFilterRange };
