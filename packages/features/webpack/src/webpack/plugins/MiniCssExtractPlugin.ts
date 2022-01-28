import { Configuration } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default function miniCssExtractPlugin(config: Configuration): void {
  config.plugins?.push(
    new MiniCssExtractPlugin({
      chunkFilename: "[name].[chunkhash:8].css"
    })
  );
}
