import { error } from "@packi_/printer";
import help from "./help";

const actions: { [k: string]: string } = {
  init: "@packi_/feature-scaffold/cjs/init",
  "add-template": "@packi_/feature-scaffold/cjs/add-template",

  make: "@packi_/feature-webpack/cjs/make",
  start: "@packi_/feature-webpack/cjs/start",

  npmpub: "@packi_/feature-npm/cjs/npmpub",
};

export default async function getAction(command: string): Promise<((...args: any[]) => Promise<number>) | undefined> {
  if (command === "help") {
    return help
  }

  try {
    const actionItem = actions[command];

    if (!actionItem) {
      return void 0;
    }

    const ret = (await import(actionItem)).default;
    return ret;
  } catch (err) {
    error((err as Error).message);
    return void 0;
  }
}
