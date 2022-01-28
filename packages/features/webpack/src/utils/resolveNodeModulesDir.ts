import { resolve } from "path";
import { existsSync, statSync } from "fs";

export default function resolveNodeModulesDirs(currentDir: string): string[] {
  let rootDir = currentDir;
  const candidates = [resolve(rootDir, "./node_modules")];

  while (rootDir) {
    const dir = resolve(rootDir, "..");

    if (dir === rootDir) {
      break;
    }

    rootDir = dir;
    candidates.push(resolve(rootDir, "./node_modules"));
  }

  const ret = candidates.filter(el => {
    return existsSync(el) && statSync(el).isDirectory();
  });

  return ret;
}
