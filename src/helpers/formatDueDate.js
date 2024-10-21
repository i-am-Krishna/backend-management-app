/**
 * Formats a given date into a readable string in 'en-GB' format.
 * @param {Date|string|null} date - The date to be formatted, can be a Date object, a date string, or null.
 * @returns {string|null} - Returns the formatted date string or null if the input date is invalid.
 */
const formatDueDate = (date) => {
  // If the date is null or undefined, return null
  if (!date) return null;

  // Create a new Date object from the input and format it to 'en-GB' style
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',  // Display the day as a number
    month: 'short',  // Display the month as a short string (e.g., 'Jan', 'Feb')
  });
};

// Exporting the function for use in other parts of the application
module.exports = { formatDueDate };
