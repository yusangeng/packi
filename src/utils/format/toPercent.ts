import { constants } from "fs";

export default function toPercent(value: number) {
  let str = Number(value * 100).toFixed(1);
  str += "%";
  return str;
}
