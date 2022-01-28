export default function toPercent(value: number): string {
  let str = Number(value * 100).toFixed(1);
  str += "%";
  return str;
}
