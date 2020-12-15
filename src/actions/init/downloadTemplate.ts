import fs from "fs";
import path from "path";
import mkdir from "mkdirp";
import download from "download";
import decompress from "decompress";
import { debug, info } from "packi-print";

export default async function downloadTemplate(cwd: string, url: string): Promise<string> {
  const scaffoldDir = path.resolve(cwd, "./.packi");
  const scaffoldAcrhiveFilename = path.resolve(scaffoldDir, "./__packi_archive__.zip");

  info("Downloading archive file...");
  const data = await download(url);

  info("Making scaffold dir...");
  mkdir.sync(scaffoldDir);

  fs.writeFileSync(scaffoldAcrhiveFilename, data);

  info(`Decompressing...`);

  let rootDir = "";

  await decompress(scaffoldAcrhiveFilename, cwd, {
    map: file => {
      if (!rootDir.length) {
        rootDir = file.path.replace(/\/$/, "");
        debug(`rootDir = ${rootDir}`);

        file.path = "";
        return file;
      }

      const pattern = new RegExp(`^${rootDir}.*?\\/`);

      file.path = file.path.replace(pattern, "");
      debug(`Decompressing file: ${file.path}`);
      return file;
    }
  });

  return scaffoldDir;
}
