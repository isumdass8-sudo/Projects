/**
 * Simulated monthly-income engine for the academic demo.
 *
 * In real life, a company would credit a payout on a schedule (e.g. a cron
 * job run once a month). Since a student demo can't wait months to show
 * that behaviour, this engine works out how many months have elapsed since
 * a contribution's start_date and returns a payout row for each elapsed
 * month, up to the plan's duration. This lets the dashboard show a
 * realistic month-by-month growth history immediately.
 */

function monthsElapsed(startDate, now = new Date()) {
  const start = new Date(startDate);
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

/**
 * Builds the full payout schedule for a contribution.
 * @param {{amount:number, monthly_rate:number, duration_months:number, start_date:string}} contribution
 * @returns {Array<{month_number:number, amount:number, payout_date:string, status:'paid'|'pending'}>}
 */
function buildPayoutSchedule(contribution) {
  const elapsed = monthsElapsed(contribution.start_date);
  const totalMonths = contribution.duration_months;
  const monthlyAmount = Number(
    (contribution.amount * contribution.monthly_rate).toFixed(2)
  );

  const schedule = [];
  for (let m = 1; m <= totalMonths; m++) {
    const payoutDate = new Date(contribution.start_date);
    payoutDate.setMonth(payoutDate.getMonth() + m);

    schedule.push({
      month_number: m,
      amount: monthlyAmount,
      payout_date: payoutDate.toISOString().slice(0, 10),
      status: m <= elapsed ? 'paid' : 'pending'
    });
  }
  return schedule;
}

function summarize(contribution) {
  const schedule = buildPayoutSchedule(contribution);
  const paid = schedule.filter((p) => p.status === 'paid');
  const totalPaidOut = paid.reduce((sum, p) => sum + p.amount, 0);
  const isMatured = paid.length >= contribution.duration_months;

  return {
    schedule,
    totalPaidOut: Number(totalPaidOut.toFixed(2)),
    monthsCompleted: paid.length,
    monthsRemaining: Math.max(0, contribution.duration_months - paid.length),
    isMatured
  };
}

module.exports = { monthsElapsed, buildPayoutSchedule, summarize };
