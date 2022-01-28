import { Configuration } from "webpack";

export default function image(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.(gif|png|jpe?g)$/i,
    use: [
      {
        loader: "url-loader",
        options: {
          limit: 4096
        }
      }
    ]
  });
}
