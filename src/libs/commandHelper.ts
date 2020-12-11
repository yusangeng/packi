import execa from "execa";

export async function exec(command: string, args: string[] = []) {
  const subProcess = execa(command, args);

  if (subProcess.stdout) {
    subProcess.stdout.pipe(process.stdout);
  }

  const result = await subProcess;

  return result;
}

export async function getStdout(command: string, args: string[] = []) {
  const { stdout } = await execa(command, args);
  return stdout;
}
