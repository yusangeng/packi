import { Configuration } from "webpack";

export default function esbuild(config: Configuration): void {
  // ts/js/tsx/jsx
  config.module?.rules?.push({
    test: /\.(jsx?|tsx?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "esbuild-loader",
        options: {
          loader: "tsx",
          target: "es2015"
        }
      }
    ]
  });
}
