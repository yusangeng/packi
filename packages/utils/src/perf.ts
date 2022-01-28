import { debug } from "@packi_/printer";

export async function perfTask(name: string, task: () => Promise<void>): Promise<void> {
  const startTime = Date.now();

  await task();

  const time = Date.now() - startTime;
  debug(`[perf metrics] The task(${name}) spends ${time} ms.`);
}

export default function perf(task: string): () => void {
  const startTime = Date.now();

  return function end() {
    const time = Date.now() - startTime;
    debug(`[perf metrics] task(${task}) spends ${time} ms.`);
  };
}
