/**
 * Calculates the next attempt date using exponential backoff.
 * Retry 1 → 1 minute
 * Retry 2 → 5 minutes
 * Retry 3 → 15 minutes
 * Retry 4 → 1 hour
 * Retry 5 → Fail completely
 *
 * Returns null if the max retries have been reached.
 */
export function getNextRetryTime(currentRetryCount: number): Date | null {
  const MAX_RETRIES = 5;

  if (currentRetryCount >= MAX_RETRIES) {
    return null;
  }

  const delaysMinutes = [1, 5, 15, 60, 120]; // delays based on retry index
  const minutesToAdd = delaysMinutes[currentRetryCount] || 60;

  const nextDate = new Date();
  nextDate.setMinutes(nextDate.getMinutes() + minutesToAdd);

  return nextDate;
}
