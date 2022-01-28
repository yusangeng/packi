import { Configuration } from "webpack";

export default function json5(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.json5$/,
    exclude: /\/profile\.json5$/i,
    use: ["json5-loader"]
  });
}
