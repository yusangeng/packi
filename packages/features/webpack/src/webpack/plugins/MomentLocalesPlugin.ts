import { Configuration } from "webpack";
import MomentLocalesPlugin from "moment-locales-webpack-plugin";

export default function momentPlugin(config: Configuration): void {
  config.plugins?.push(
    //@ts-ignore
    new MomentLocalesPlugin({
      localesToKeep: ["zh-cn"]
    })
  );
}
