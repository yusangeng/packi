import chalk from "chalk";
import { log } from "./driver";

export enum PRINT_LEVEL {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NEVER = 99
}

let printLevel = PRINT_LEVEL.INFO;
let printPrefix = "packi";

export function setPrintLevel(level: PRINT_LEVEL) {
  printLevel = level;
}

export function setPrintPrefix(prefix: string) {
  printPrefix = prefix;
}

export function printPackageInfo(name: string, version: string): void {
  const t = `${name} - ${version}`;
  log("\n");
  info(chalk.bold(t));
}

export function debugLine(text: string): void {
  log(`${printPrefix} ${chalk.hex("#014d67")("debug")} ${text}`);
}

export function infoLine(text: string): void {
  log(`${printPrefix} ${chalk.hex("#608f9f")("info")} ${text}`);
}

export function warnLine(text: string): void {
  log(`${printPrefix} ${chalk.hex("#fbb217")("warning")} ${text}`);
}

export function errorLine(text: string): void {
  log(`${printPrefix} ${chalk.hex("#db4520")("error")} ${text}`);
}

export function successLine(text: string): void {
  log(`${printPrefix} ${chalk.hex("#b2be7e")("done")} ${text}`);
}

export function printLines(text: string, fn: (text: string) => void): void {
  if (Array.isArray(text)) {
    text.forEach(el => {
      printLines(el, fn);
    });

    return;
  }

  if (typeof text !== "string") {
    let content;
    try {
      content = JSON.stringify(text, null, 2);
    } catch (err) {
      content = text;
    }

    printLines(">>>>----", fn);
    log(content);
    printLines("----<<<<", fn);
    return;
  }

  const lines = text.split("\n");

  if (lines.length === 1) {
    fn(text);
    return;
  }

  lines.forEach(line => fn(line));
}

export function debug(text: string): void {
  if (printLevel > PRINT_LEVEL.DEBUG) {
    return;
  }

  printLines(text, debugLine);
}

export function info(text: string): void {
  if (printLevel > PRINT_LEVEL.INFO) {
    return;
  }

  printLines(text, infoLine);
}

export function warn(text: string): void {
  if (printLevel > PRINT_LEVEL.WARN) {
    return;
  }

  printLines(text, warnLine);
}

export function error(text: string): void {
  if (printLevel > PRINT_LEVEL.ERROR) {
    return;
  }

  printLines(text, errorLine);
}

export function success(text: string): void {
  if (printLevel > PRINT_LEVEL.WARN) {
    return;
  }

  printLines(text, successLine);
}

export function declareAction(actionName: string, actionDescription?: string): void {
  const desc = actionDescription ? `: ${actionDescription}` : "";
  printLines(`${chalk.bold(actionName)}${desc}.\n`, infoLine);
}