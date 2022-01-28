import { Configuration } from "webpack";

export function url(config: Configuration): void {
  config.module?.rules?.push({
    test: /\.(gif|png|jpe?g|woff2?|eot|ttf|otf|mp3|mp4)$/i,
    use: [
      {
        loader: "url-loader",
        options: {
          limit: 40960,
          name: "[name].[hash:7].[ext]"
        }
      }
    ]
  });
}
