import execa from "execa";

export default async function getStdout(command: string, args: string[] = []): Promise<string> {
  const { stdout } = await execa(command, args);
  return stdout;
}
