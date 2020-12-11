import fs from "fs";
import path from "path";
import fileExists from "file-exists";
import userHome from "user-home";
import { merge } from "lodash";

type GlobalData = {
  templates: {
    [name: string]: string;
  };
  start: {
    port: number;
  };
  npmpub: {
    registry: string;
  };
};

const globalDataFilename = path.resolve(userHome, "./.packi.json");
let globalDataFileContent = {};

if (fileExists.sync(globalDataFilename)) {
  const jsonData = fs.readFileSync(globalDataFilename, { encoding: "utf8" });

  try {
    globalDataFileContent = JSON.parse(jsonData);
  } catch (err) {
    // todo
  }
}
let cachedContent: GlobalData = merge(
  {},
  {
    templates: {
      lib: "https://github.com/yusangeng/packi-template-tslib/archive/master.zip",
      web: "https://github.com/yusangeng/packi-template-web/archive/master.zip",
      component: "https://github.com/yusangeng/packi-template-component/archive/master.zip"
    },
    start: {
      port: 3210
    },
    npmpub: {
      registry: "https://registry.npmjs.org"
    }
  },
  globalDataFileContent
);

write(cachedContent);

export function read(): GlobalData {
  // const data = JSON.parse(fs.readFileSync(globalDataFilename, { encoding: 'utf8' }))
  // return data as GlobalData

  return cachedContent;
}

export function write(data: GlobalData): void {
  const content = merge({}, cachedContent, data);

  fs.writeFileSync(globalDataFilename, JSON.stringify(content, null, 2), {
    encoding: "utf8"
  });

  cachedContent = content;
}
