import { Configuration } from "webpack";

export function sourcemap(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.js?$/,
    use: ["source-map-loader"],
    enforce: "pre"
  });
}
