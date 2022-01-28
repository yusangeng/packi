import * as semver from "semver";

export default function isLegalVersion(version: string): boolean {
  const ret = semver.valid(version);

  return !!ret;
}
