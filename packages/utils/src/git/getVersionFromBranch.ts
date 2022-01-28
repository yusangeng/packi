export default function getVersionFromBranch(branchName: string): string {
  return branchName.replace(/^daily-/, "");
}
