export default function isLegalBranch(branchName: string): boolean {
  if (branchName === "master") {
    // 允许master参与日常CI，因为每次发布线上的时候，代码都会合并会master，此时发布一个master日常版本，作为benchmark
    return true;
  }

  return /daily-\d+\.\d+\.\d+/.test(branchName);
}
