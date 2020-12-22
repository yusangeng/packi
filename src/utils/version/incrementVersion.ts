import * as semver from "semver";
import isLegalVersion from "./isLegalVersion";

export default function incrementVersion(version: string) {
  if (!isLegalVersion(version)) {
    throw new Error(`Version ${version} is illegal.`);
  }

  return semver.inc(version, "patch");
}
