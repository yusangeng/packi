import fs from "fs";
import path from "path";
import rm from "rimraf";
import cah from "command-arguments-helper";
import { info, error, declareAction } from "@packi_/printer";
import { read } from "@packi_/rc";
import downloadTemplate from "./downloadTemplate";
import execEJS from "./execEJS";

function isPathEmpty(path: string): boolean {
  const files = fs.readdirSync(path);
  return files.length === 0;
}

export default function init(cwd: string, appName: string, ...rest: string[]): Promise<number> {
  const realArgs = cah<[string, string, "web" | "mobile", boolean, string, string]>(
    ["template", "name", "target", "force", "templatedata", "templatedatafile"],
    rest
  );

  return init_(cwd, appName, ...realArgs);
}

async function init_(
  cwd: string,
  appName: string,
  templateName: string,
  projectName: string,
  target: "web" | "mobile",
  force = false,
  templateDataString = "",
  templateDataFile = ""
): Promise<number> {
  declareAction("init", "init project folder");

  if (!force && !isPathEmpty(cwd)) {
    error("Current working directory is NOT empty.");
    return 1;
  }

  const data = read();
  const { templates } = data;
  let url = templates[templateName];

  if (!url) {
    if (templateName.startsWith("http")) {
      url = templateName;
    }

    if (!url) {
      error(`Bad template name: ${templateName}.`);
      error(`Please execute "packi help" for help.`);
      return 1;
    }
  }

  info(`Template URL: ${url}`);

  projectName = projectName || path.basename(cwd);
  info(`Project name: ${projectName}`);

  const tempDir = await downloadTemplate(cwd, url);

  info(`Deleting temperate files...`);
  rm.sync(tempDir);

  let templateDataFromFile = {};
  try {
    if (templateDataFile) {
      const absTemplateDataFilename = path.resolve(cwd, templateDataFile);
      const content = fs.readFileSync(absTemplateDataFilename, { encoding: "utf8" });

      templateDataFromFile = JSON.parse(content);
    }
  } catch (err) {
    templateDataFromFile = {};
  }

  let templateData = {};
  try {
    if (templateDataString) {
      templateData = JSON.parse(templateDataString);
    }
  } catch (err) {
    templateData = {};
  }

  await execEJS(cwd, { ...templateDataFromFile, ...templateData, projectName, target });

  return 0;
}
