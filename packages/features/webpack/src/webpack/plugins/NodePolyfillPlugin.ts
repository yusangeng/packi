import { Configuration } from "webpack";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

export default function nodePolyfillPlugin(config: Configuration): void {
  config.plugins?.push(new NodePolyfillPlugin());
}
