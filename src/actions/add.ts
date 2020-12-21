import { declareAction, info, error, warn } from "packi-print";
import { read, write } from "~/settings";

export default function add(cwd: string, appName: string, templateName: string, url: string): number {
  declareAction("add", "add project template");

  const data = read();
  const { templates } = data;

  if (!templateName) {
    error(`Bad template name: ${templateName}.`);
    error(`Please execute "packi help" for help.`);
    return 1;
  }

  if (!url) {
    error(`Bad template URL: ${url}.`);
    error(`Please execute "packi help" for help.`);
    return 1;
  }

  const originalURL = templates[templateName];

  if (originalURL) {
    warn(`URL of template "${templateName}" is going to be covered.`);
    warn(`>    New: ${url}`);
    warn(`> Former: ${originalURL}`);
  } else {
    info(`New template: ${templateName} => ${url}.`);
  }

  data.templates[templateName] = url;

  write(data);

  return 0;
}
