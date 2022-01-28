import fs from "fs";
import path from "path";
import cah from "command-arguments-helper";
import { read } from "@packi_/rc";
import { declareAction, info, error } from "@packi_/printer";
import exec from "@packi_/utils/cjs/command/exec";
import isLegalVersion from "@packi_/utils/cjs/version/isLegalVersion";
import compareVersion from "@packi_/utils/cjs/version/compareVersion";
import incrementVersion from "@packi_/utils/cjs/version/incrementVersion";

export default function npmpub(cwd: string, appName: string, ...rest: string[]): Promise<number> {
  const realArgs = cah<[string, boolean, boolean, boolean]>(["version", "force", "beta", "public"], rest);

  return npmpub_(cwd, appName, ...realArgs);
}

async function npmpub_(
  cwd: string,
  appName: string,
  version: string,
  isForce: boolean,
  isBeta: boolean,
  isPublic: boolean
): Promise<number> {
  declareAction("npmpub", "publish package to npm");

  const data = read();
  const { npmpub } = data;
  const { registry } = npmpub;

  info(`Step1: increment or set version.`);

  const packageInfoFilename = path.resolve(cwd, "package.json");
  let packageInfo;

  try {
    packageInfo = JSON.parse(fs.readFileSync(packageInfoFilename, { encoding: "utf8" }));
  } catch (err) {
    error(`Read package file error: ${(err as any).message}`);
    return 1;
  }

  const currentVersion = packageInfo.version;
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
    newVersion = incrementVersion(packageInfo.version, isBeta);
  }

  info(`The publishing version is ${newVersion}.`);

  packageInfo.version = newVersion;
  fs.writeFileSync(packageInfoFilename, JSON.stringify(packageInfo, null, 2), { encoding: "utf8" });

  info(`Step2: npm publish.`);

  const npmpublishArgs = ["publish", "--registry", registry];

  if (isPublic) {
    npmpublishArgs.push("--access");
    npmpublishArgs.push("public");
  }

  let result = await exec("npm", npmpublishArgs);
  if (result.failed) {
    error(`npm publish failed.`);
    return 1;
  }

  info(`Step3: push code to repo.`);

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
