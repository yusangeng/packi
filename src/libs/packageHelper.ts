import fs from "fs";
import path from "path";

let packageInfoCache: any = null;

export function getPackageInfo() {
  if (!packageInfoCache) {
    packageInfoCache = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../package.json"), {
        encoding: "utf8"
      })
    );
  }

  return packageInfoCache;
}
