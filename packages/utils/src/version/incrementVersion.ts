import * as semver from "semver";
import isLegalVersion from "./isLegalVersion";

export default function incrementVersion(version: string, isBeta: boolean): string {
  if (!isLegalVersion(version)) {
    throw new Error(`Version ${version} is illegal.`);
  }

  const ret = semver.inc(version, isBeta ? "prerelease" : "patch");

  if (!ret) {
    throw new Error(`version(${version}) is NOT valid.`);
  }

  return ret;
}
