// Simple library policy settings.
// In a later phase these could move to a database "settings" table
// so admins can change them from the UI without redeploying code.

module.exports = {
  LOAN_DURATION_DAYS: 14,   // how many days a book can be borrowed for
  DAILY_FINE_RATE: 10       // fine charged per day overdue (in your currency)
};
