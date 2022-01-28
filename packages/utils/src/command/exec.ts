import execa, { ExecaReturnValue } from "execa";

export default async function exec(command: string, args: string[] = []): Promise<ExecaReturnValue<string>> {
  const subProcess = execa(command, args);

  if (subProcess.stdout) {
    subProcess.stdout.pipe(process.stdout);
  }

  const result = await subProcess;

  return result;
}
