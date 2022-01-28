import path from "path";
import { Configuration } from "webpack";

type Options = {
  cwd: string;
};

export default function ts(config: Configuration, { cwd }: Options): void {
  // ts/js/tsx/jsx
  config.module?.rules?.push({
    test: /\.(jsx?|tsx?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          configFile: path.resolve(cwd, "./tsconfig.json")
        }
      }
    ]
  });
}
