const formatDueDate = (date) => {
  // If the date is null or undefined, return null
  if (!date) return null;

  const dateObj = new Date(date);

  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('en-GB', { month: 'short' });

  // Determine the appropriate suffix for the day
  const suffix = (day) => {
    if (day % 10 === 1 && day !== 11) return "st";
    if (day % 10 === 2 && day !== 12) return "nd";
    if (day % 10 === 3 && day !== 13) return "rd";
    return "th";
  };

  // Return the formatted date with day, suffix, and month
  return `${month} ${day}${suffix(day)}`;
};

// Exporting the function for use in other parts of the application
module.exports = { formatDueDate };
