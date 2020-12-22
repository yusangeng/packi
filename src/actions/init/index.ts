import fs from "fs";
import path from "path";
import rm from "rimraf";
import cah from "command-arguments-helper";
import { info, error, declareAction } from "packi-print";
import { read } from "~/settings";
import downloadTemplate from "./downloadTemplate";
import execEJS from "./execEJS";

function isPathEmpty(path: string): boolean {
  const files = fs.readdirSync(path);
  return files.length === 0;
}

export default function init(cwd: string, appName: string, ...rest: string[]) {
  const realArgs = cah<[string, string, "web" | "mobile"]>(["template", "name", "target"], rest);

  return init_(cwd, appName, ...realArgs);
}

async function init_(
  cwd: string,
  appName: string,
  templateName: string,
  projectName: string,
  target: "web" | "mobile"
): Promise<number> {
  declareAction("init", "init project folder");

  if (!isPathEmpty(cwd)) {
    error("Current working directory is NOT empty.");
    return 1;
  }

  const data = read();
  const { templates } = data;

  const url = templates[templateName];

  if (!url) {
    error(`Bad template name: ${templateName}.`);
    error(`Please execute "packi help" for help.`);
    return 1;
  }

  info(`Template URL: ${url}`);

  projectName = projectName || path.basename(cwd);
  info(`Project name: ${projectName}`);

  const tempDir = await downloadTemplate(cwd, url);

  info(`Deleting temperate files...`);
  rm.sync(tempDir);

  await execEJS(cwd, { projectName, target });

  return 0;
}
