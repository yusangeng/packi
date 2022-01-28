import getStdout from "../command/getStdout";

export default async function getRemoteURL(remoteName = "origin"): Promise<string> {
  const url = await getStdout("git", ["ls-remote", "--get-url", remoteName]);
  return url;
}
