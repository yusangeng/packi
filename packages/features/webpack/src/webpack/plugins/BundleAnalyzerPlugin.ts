import { Configuration } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export default function bundleAnalyzerPlugin(config: Configuration): void {
  config.plugins?.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false
    })
  );
}
