import { DefinePlugin, Configuration } from "webpack";
import os from "os";
function getIPAdress() {
  const interfaces = os.networkInterfaces();
  //console.log("interfaces", interfaces);
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface!.length; i++) {
      const alias = iface![i];
      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        return alias.address;
      }
    }
  }
}
type Options = {
  mode: "dev" | "prod";
  addinDefinitions?: Record<string, any>;
};

export default function definePlugin(config: Configuration, { mode, addinDefinitions = {} }: Options): void {
  const isDev = mode === "dev";

  config.plugins?.push(
    new DefinePlugin({
      "process.env.NODE_ENV": `"${isDev ? "development" : "production"}"`,
      "process.env.DEBUG": isDev,
      ...addinDefinitions
    })
  );
}
