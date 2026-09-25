/**
 * Formats seconds into mm:ss format.
 * @param {number} value - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(value) {
  const total = Math.max(0, Math.floor(Number(value) || 0));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
