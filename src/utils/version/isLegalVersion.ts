import * as semver from "semver";

export default function isLegalVersion(version: string) {
  const ret = semver.valid(version);

  return !!ret;
}
