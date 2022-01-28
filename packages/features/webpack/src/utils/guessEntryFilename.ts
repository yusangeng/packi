import fs from "fs";
import path from "path";
import fileExists from "file-exists";
import { info, warn } from "@packi_/printer";

export default function guessEntryFilename(cwd: string, entrySearchDirs: string[]): string {
  const packageFilename = path.resolve(cwd, "./package.json");

  if (!fileExists.sync(packageFilename)) {
    throw new Error("Can NOT find package.json.");
  }

  const packageText = fs.readFileSync(packageFilename, { encoding: "utf8" });
  const packageCOntent = JSON.parse(packageText);
  const mainEntry = packageCOntent["jsnext:main"];

  if (mainEntry) {
    const filename = path.resolve(cwd, mainEntry);

    if (fileExists.sync(filename)) {
      info(`Found jsnext:main entry file: ${filename}`);
      info(`Entry filename: ${mainEntry}`);

      return mainEntry;
    }
  }

  function findFilename(nameList: string[], prefix: string) {
    const result = nameList.find(el => {
      const name = prefix + el;
      const filename = path.resolve(cwd, name);

      if (fileExists.sync(filename)) {
        info(`Found guessed entry file: ${filename}`);
        return true;
      }
    });

    return result ? `${prefix}${result}` : "";
  }

  const arr = ["index.tsx", "index.ts", "index.jsx", "index.js"];

  for (const searchDir of entrySearchDirs) {
    const ret = findFilename(arr, searchDir);
    if (ret) {
      info(`Entry filename: ${ret}`);
      return ret;
    }
  }

  warn(`Entry file NOT found.`);

  return "";
}
