import getStdout from "../command/getStdout";

export default async function getCurrentBranchName(): Promise<string> {
  const branchName = await getStdout("git", ["symbolic-ref", "--short", "-q", "HEAD"]);
  return branchName;
}
