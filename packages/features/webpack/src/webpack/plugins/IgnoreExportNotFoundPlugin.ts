import { Configuration } from "webpack";
import IgnoreExportNotFoundPlugin from "ignore-not-found-export-webpack-plugin";

export default function bundleAnalyzerPlugin(config: Configuration): void {
  config.plugins?.push(new IgnoreExportNotFoundPlugin());
}
