import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration, RuleSetUseItem } from "webpack";
import getPostCSSConfig from "./getPostCSSConfig";

type Options = {
  mode: string;
  useCSSModule: boolean;
  target: string;
  viewportWidth: number;
};

function getLessLoaderConfig({ mode, useCSSModule, target, viewportWidth }: Options): RuleSetUseItem[] {
  const isDev = mode === "dev";

  return [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: "css-loader",
      options: {
        modules: !!useCSSModule,
        importLoaders: 1,
        sourceMap: isDev
      }
    },
    getPostCSSConfig({ target, viewportWidth }),
    {
      loader: "less-loader",
      options: {
        sourceMap: isDev,
        lessOptions: {
          javascriptEnabled: true,
          strictMath: false
        }
      }
    }
  ];
}

export function less(config: Configuration, { mode, useCSSModule, target, viewportWidth }: Options): void {
  config.module?.rules?.push({
    test: /\.less$/,
    exclude: /yx-widget\/.*\.less$/,
    use: getLessLoaderConfig({ mode, useCSSModule, target, viewportWidth })
  });
}

export function lessYunxi(config: Configuration, { mode, useCSSModule, target, viewportWidth }: Options): void {
  config.module?.rules?.push({
    test: /yx-widget\/.*\.less$/,
    use: getLessLoaderConfig({ mode, useCSSModule, target, viewportWidth })
  });
}
