import * as semver from "semver";
import isLegalVersion from "./isLegalVersion";

export default function compareVersion(version1: string, version2: string) {
  if (!isLegalVersion(version1)) {
    throw new Error(`Version1 ${version1} is illegal.`);
  }

  if (!isLegalVersion(version2)) {
    throw new Error(`Version1 ${version2} is illegal.`);
  }

  return semver.compare(version1, version2);
}
