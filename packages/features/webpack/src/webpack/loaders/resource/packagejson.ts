import { Configuration } from "webpack";

export default function packagejson(config: Configuration): void {
  config.module?.rules?.push({
    test: /package\.json$/,
    use: [
      {
        loader: "package-json-cleanup-loader",
        options: {
          only: ["name", "version", "description"]
        }
      }
    ]
  });
}
