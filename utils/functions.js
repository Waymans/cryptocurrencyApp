export function getColor(num) {
  if (num < 0) {
    return { color: 'red' };
  } else {
    return { color: 'green' };
  }
}
export function financial(num) {
  return Number.parseFloat(num).toFixed(2);
}