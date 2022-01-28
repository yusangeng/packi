import { Configuration } from "webpack";

export function svg(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.svg$/,
    exclude: /asset\.svg$/,
    use: ["@svgr/webpack"]
  });
}

export function svgAsset(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.asset\.svg$/,
    loader: "url-loader",
    options: {
      limit: 40960,
      name: "[name].[hash:7].[ext]"
    }
  });
}
