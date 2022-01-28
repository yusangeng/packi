import { Configuration } from "webpack";

export default function font(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.(ttf|eot|woff|woff2?g)$/i,
    use: [
      {
        loader: "url-loader"
      }
    ]
  });
}
