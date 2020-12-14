import chalk from "chalk";

let debugPrint = false;

export function enableDebugPrint() {
  debugPrint = true;
}

export function printPackageInfo(name: string, version: string): void {
  const t = `>>>>---- ${name} - ${version} ----<<<<`;

  console.log("\n");
  info(t);
}

export function debugLine(text: string): void {
  console.log(`packi ${chalk.hex("#014d67")("debug")}  ${text}`);
}

export function infoLine(text: string): void {
  console.log(`packi ${chalk.hex("#608f9f")("info")}  ${text}`);
}

export function warnLine(text: string): void {
  console.log(`packi ${chalk.hex("#fbb217")("warnning")}  ${text}`);
}

export function errorLine(text: string): void {
  console.log(`packi ${chalk.hex("#db4520")("error")}  ${text}`);
}

export function successLine(text: string): void {
  console.log(`packi ${chalk.hex("#b2be7e")("success")}  ${text}`);
}

export function actionLine(text: string): void {
  console.log(`packi ${chalk.hex("#608f9f")("action")}  ${text}`);
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
    console.log(content);
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
  if (!debugPrint) {
    return;
  }

  printLines(text, debugLine);
}

export function info(text: string): void {
  printLines(text, infoLine);
}

export function warn(text: string): void {
  printLines(text, warnLine);
}

export function error(text: string): void {
  printLines(text, errorLine);
}

export function success(text: string): void {
  printLines(text, successLine);
}

export function declareAction(actionName: string, actionDescription?: string): void {
  const desc = actionDescription ? `: ${actionDescription}` : "";
  printLines(`>>>>---- ${actionName}${desc} ----<<<<`, actionLine);
}
