import { HotModuleReplacementPlugin, Configuration } from "webpack";
import ts from "../webpack/loaders/script/ts";
import { svg, svgAsset } from "../webpack/loaders/resource/svg";
import { css, cssModules } from "../webpack/loaders/style/css";
import { less } from "../webpack/loaders/style/less";
import { url } from "../webpack/loaders/resource/url";
import raw from "../webpack/loaders/resource/raw";
import json5 from "../webpack/loaders/resource/json5";
import json5Profile from "../webpack/loaders/private/json5Profile";
import pluggableMarkdown from "../webpack/loaders/private/pluggableMarkdown";
import definePlugin from "../webpack/plugins/DefinePlugin";
import miniCssExtractPlugin from "../webpack/plugins/MiniCssExtractPlugin";
import momentPlugin from "../webpack/plugins/MomentLocalesPlugin";
import nodePolyfillPlugin from "../webpack/plugins/NodePolyfillPlugin";
import progressPlugin from "../webpack/plugins/ProgressPlugin";
import reactRefreshPlugin from "../webpack/plugins/ReactRefreshWebpackPlugin";
//import esbuild from "../webpack/loaders/script/esbuild";
import ignoreExportNotFoundPlugin from "../webpack/plugins/IgnoreExportNotFoundPlugin";

type Options = {
  cwd: string;
  mode: "dev" | "prod";
  target: "web" | "mobile";
  viewportWidth: number;
};

export default function addLoadersAndPlugins(
  config: Configuration,
  { cwd, mode, target, viewportWidth }: Options
): void {
  ts(config, { cwd });
  //esbuild(config);

  less(config, { mode, target, viewportWidth, useCSSModule: false });
  //lessYunxi(config, { mode, target, useCSSModule: false });
  cssModules(config, { mode, target, viewportWidth });
  css(config, { mode, target, viewportWidth });

  svg(config);
  svgAsset(config);

  url(config);
  raw(config);
  json5(config);

  json5Profile(config);
  pluggableMarkdown(config, { cwd });

  nodePolyfillPlugin(config);
  definePlugin(config, { mode });
  miniCssExtractPlugin(config);
  momentPlugin(config);
  reactRefreshPlugin(config);
  progressPlugin(config);
  ignoreExportNotFoundPlugin(config);

  config.plugins?.push(new HotModuleReplacementPlugin());
}
