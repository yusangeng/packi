import { createServer } from "net";

export default function getUsablePort(defaultPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer().listen(defaultPort);

    server.on("listening", () => {
      server.close();
      resolve(defaultPort);
    });

    server.on("error", (err: { code: string }) => {
      if (err.code === "EADDRINUSE") {
        const newCandidate = defaultPort + 1;

        getUsablePort(newCandidate).then((newPort: number) => {
          resolve(newPort);
        });
      } else {
        reject(err);
      }
    });
  });
}
