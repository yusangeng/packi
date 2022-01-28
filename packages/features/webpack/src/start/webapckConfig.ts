import path from "path";
import { info } from "@packi_/printer";
import { Configuration } from "webpack";
import { ESBuildMinifyPlugin } from "esbuild-loader";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import guessEntryFilename from "../utils/guessEntryFilename";
import addLoadersAndPlugins from "./addLoadersAndPlugins";
import resolveNodeModulesDirs from "../utils/resolveNodeModulesDir";

type Options = {
  cwd: string;
  // dev表示开发模式（不压缩代码，产生sourcemap），prod表示生产模式
  mode: "dev" | "prod";
  target: "web" | "mobile";
  entryFilename?: string;
  entrySearchDirs?: string[];
  library?: string;
  externals?: Record<string, string>;
  outputpath?: string;
  publicpath?: string;
  viewportWidth: number;
};

function getMode(isDev: boolean) {
  return isDev ? "development" : "production";
}

function getEntry(cwd: string, entryFilename: string, entrySearchDirs: string[]) {
  let filename: string;
  let entryName = "index";

  // entryFilename优先，如果没有entryFilename字段，再执行搜索操作
  if (entryFilename) {
    filename = path.resolve(cwd, entryFilename);
    entryName = path.basename(filename, path.extname(filename));
  } else {
    filename = guessEntryFilename(cwd, entrySearchDirs);
  }

  info(`Webpack building entry: ${entryName} - ${filename}`);

  return {
    [entryName]: filename
  };
}

function getOutput(cwd: string, isDev: boolean, library?: string, outputpath?: string, publicpath?: string) {
  const libraryName = library?.replace(/"'/g, "");

  let output: Configuration["output"];

  if (libraryName) {
    output = {
      library: libraryName,
      // 如果打包为库，则统一打包成umd模式
      libraryTarget: "umd",
      umdNamedDefine: true,
      filename: "[name].js"
    };
  } else {
    output = {
      filename: "[name].js",
      chunkFilename: "[name].[contenthash:8].js"
    };
  }

  // 为了利于抓取异常
  output.crossOriginLoading = "anonymous";
  output.devtoolModuleFilenameTemplate = "webpack://[namespace]/[absolute-resource-path]?[loaders]";

  const outputDir = outputpath ? outputpath : ".publish";

  output.path = path.resolve(cwd, `./${outputDir}`);
  output.pathinfo = isDev;

  if (isDev) {
    output.publicPath = "/";
  } else {
    output.publicPath = publicpath || "/";
  }

  return output;
}

function getOptimization(isDev: boolean) {
  if (isDev) {
    return {};
  }
  return {
    splitChunks: {
      chunks: "async" as const
    },
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: false
      }),
      // fixme: ESBuildMinifyPlugin压缩css出错，暂时使用老方案
      new CssMinimizerPlugin()
    ]
  };
}

function getDevtool(isDev: boolean) {
  return isDev ? "inline-source-map" : void 0;
}

function getResolve(cwd: string) {
  return {
    alias: {
      "~": path.resolve(cwd, "./src/")
    },

    extensions: [".tsx", ".ts", ".jsx", ".js"]
  };
}

function getResolveLoader(cwd: string) {
  //info(`__dirname:\n${__dirname}`);
  const dirs = resolveNodeModulesDirs(__dirname).concat([path.resolve(cwd, "./node_modules"), "node_modules"]);
  info(`Resolve loader dirs:\n${dirs.join("\n")}`);

  return {
    modules: dirs
  };
}

function getPerformance() {
  return {
    hints: false as const
  };
}

export default function webpackConfig({
  cwd,
  mode = "prod",
  target = "web",
  entryFilename = "",
  entrySearchDirs = [],
  library = "",
  externals = {},
  outputpath = "",
  publicpath = "",
  viewportWidth
}: Options): Configuration {
  const config: Configuration = {} as Configuration;

  config.context = cwd;
  config.target = "web";
  config.externals = { ...externals };
  config.plugins = [];
  config.module = {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  };
  config.stats = {
    warningsFilter: "errors-warnings"
  };

  const isDev = mode === "dev";

  config.mode = getMode(isDev);
  config.entry = getEntry(cwd, entryFilename, entrySearchDirs);
  config.output = getOutput(cwd, isDev, library, outputpath, publicpath);
  config.devtool = getDevtool(isDev);
  config.optimization = getOptimization(isDev);
  config.resolve = getResolve(cwd);
  config.resolveLoader = getResolveLoader(cwd);
  config.performance = getPerformance();

  config.experiments = {
    asyncWebAssembly: true
  };

  addLoadersAndPlugins(config, { cwd, mode, target, viewportWidth });

  return config;
}
