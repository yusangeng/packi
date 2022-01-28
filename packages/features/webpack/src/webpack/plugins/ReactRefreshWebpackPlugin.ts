import { Configuration } from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";

export default function reactRefreshPlugin(config: Configuration): void {
  config.plugins?.push(new ReactRefreshWebpackPlugin());

  const rules = config.module?.rules;

  if (rules) {
    const tsconfig = rules[0];

    if (typeof tsconfig !== "string") {
      const use = tsconfig?.use;

      if (Array.isArray(use)) {
        const useConfig = use[0];

        if (typeof useConfig !== "string") {
          (useConfig as { options: { getCustomTransformers: () => unknown } }).options.getCustomTransformers = () => ({
            before: [ReactRefreshTypeScript()]
          });
        }
      }
    }
  }
}
