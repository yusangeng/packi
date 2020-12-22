import fs from "fs";
import path from "path";
import cah from "command-arguments-helper";
import { declareAction, info, error, warn } from "packi-print";
import { read } from "~/settings";
import exec from "~/utils/command/exec";
import isLegalVersion from "~/utils/version/isLegalVersion";
import compareVersion from "~/utils/version/compareVersion";
import incrementVersion from "~/utils/version/incrementVersion";

export default function npmpub(cwd: string, appName: string, ...rest: string[]) {
  const realArgs = cah<[string, boolean]>(["version", "force"], rest);

  return npmpub_(cwd, appName, ...realArgs);
}

async function npmpub_(cwd: string, appName: string, version: string, force: boolean): Promise<number> {
  declareAction("npmpub", "publish package to npm");
  //warn(`注意: 执行发布操作之前, 请确保gitlab中的最新代码已经更新到本地.`);

  const data = read();
  const { npmpub } = data;
  const { registry } = npmpub;

  info(`Step1: increment or set version.`);

  const packageInfoFilename = path.resolve(cwd, "package.json");
  let packageInfo;

  try {
    packageInfo = JSON.parse(fs.readFileSync(packageInfoFilename, { encoding: "utf8" }));
  } catch (err) {
    error(`Read package file error: ${err.message}`);
    return 1;
  }

  const currentVersion = packageInfo.version;
  const isForce = !!force;
  let newVersion;

  if (version) {
    if (!isForce && !isLegalVersion(version)) {
      error(`Illegal version ${version}.`);
      return 1;
    }

    if (!isForce && compareVersion(version, currentVersion) <= 0) {
      error(
        `The input version MUST be greater than current version in package.json, but version = ${version}, currentVersion = ${currentVersion}`
      );
      return 1;
    }

    newVersion = version;
  } else {
    newVersion = incrementVersion(packageInfo.version);
  }

  info(`The publishing version is ${newVersion}.`);

  packageInfo.version = newVersion;
  fs.writeFileSync(packageInfoFilename, JSON.stringify(packageInfo, null, 2), { encoding: "utf8" });

  info(`Step2: npm publish.`);

  let result = await exec("npm", ["publish", "--registry", registry]);
  if (result.failed) {
    error(`npm publish failed.`);
    return 1;
  }

  info(`Step3: commit & push code to repo.`);
  //warn(`注意: 这个操作会导致git提交当前目录的所有改动!!!`);

  result = await exec("git", ["add", "."]);
  if (result.failed) {
    error(`'git add .' failed.`);
    return 1;
  }

  result = await exec("git", ["commit", "-m", `npm version: ${newVersion}`]);
  if (result.failed) {
    error(`git commit failed.`);
    return 1;
  }

  result = await exec("git", ["push"]);
  if (result.failed) {
    error(`git push failed.`);
    return 1;
  }

  const tagVersion = `v${newVersion}`;
  result = await exec("git", ["tag", "-a", tagVersion, "-m", `npm version: ${newVersion}`]);
  if (result.failed) {
    error(`git tag -a ${tagVersion} failed.`);
    return 1;
  }

  result = await exec("git", ["push", "origin", tagVersion]);
  if (result.failed) {
    error(`git push origin ${tagVersion} failed.`);
    return 1;
  }

  return 0;
}
