import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import getPostCSSConfig from "./getPostCSSConfig";

type Options = {
  mode: string;
  target: string;
  viewportWidth: number;
};

export function cssModules(config: Configuration, { mode, target, viewportWidth }: Options): void {
  const isDev = mode === "dev";

  config.module?.rules?.push({
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader",
        options: {
          esModule: true,
          importLoaders: 1,
          sourceMap: isDev,
          modules: {
            namedExport: true,
            exportLocalsConvention: "camelCaseOnly",
            localIdentName: "[local]-[hash:base64:8]"
          }
        }
      },
      getPostCSSConfig({ target, viewportWidth })
    ]
  });
}

export function css(config: Configuration, { mode, target, viewportWidth }: Options): void {
  const isDev = mode === "dev";

  config.module?.rules?.push({
    test: /node_modules\/.*\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: "css-loader",
        options: {
          esModule: false,
          importLoaders: 1,
          sourceMap: isDev,
          modules: {
            namedExport: true,
            exportLocalsConvention: "camelCaseOnly",
            localIdentName: "[local]-[hash:base64:8]"
          }
        }
      },
      getPostCSSConfig({ target, viewportWidth })
    ]
  });
}
