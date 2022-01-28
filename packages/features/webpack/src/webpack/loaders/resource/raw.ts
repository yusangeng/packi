import { Configuration } from "webpack";

export default function raw(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.(txt|md)$/i,
    exclude: /\.pluggable\.md$/i,
    use: [
      {
        loader: "raw-loader"
      }
    ]
  });
}
