import webpack, { EntryObject } from "webpack";
import isFunction from "is-function";
import { Application } from "express";
import { resolve, basename, extname } from "path";
import WebpackDevServer from "webpack-dev-server";
import cah from "command-arguments-helper";
import { declareAction, info, warn } from "@packi_/printer";
import { read } from "@packi_/rc";
import getUsablePort from "@packi_/utils/cjs/network/getUsablePort";
import Mocker from "./Mocker";
import webpackConfig from "./webapckConfig";
import filterConfig from "../utils/filterConfig";

const settings = read();

export default function start(cwd: string, appName: string, ...rest: string[]): Promise<number> {
  const realArgs = cah<[string, "web" | "mobile", boolean, boolean, number]>(
    ["port", "target", "noexternal", "cache", "vw"],
    rest
  );

  return start_(cwd, appName, ...realArgs);
}

async function start_(
  cwd: string,
  appName: string,
  port: string,
  target: "web" | "mobile" = "web",
  noexternal = settings.start.noexternal,
  cache = settings.start.cache,
  viewportWidth = 375
): Promise<number> {
  declareAction("start", `launch dev server at ${port}.`);

  info(`port=${port}, target=${target}, noexternal=${noexternal}, cache=${cache}`);

  const globalDataPort = settings.start.port;
  const nPort = port ?? (await getUsablePort(globalDataPort));
  const nRealPort = parseInt("" + nPort);

  if (!nRealPort || Number.isNaN(nRealPort)) {
    throw new Error(`The server port(${port}) is illegal.`);
  }

  info(`Host: http://127.0.0.1:${nPort}`);

  // 如果是start，要优先查找demo，但是make要优先查找src
  let config = webpackConfig({
    cwd,
    mode: "dev",
    entrySearchDirs: ["./", "./demo/", "./src/"],
    target,
    externals: noexternal ? {} : settings.make.externals,
    viewportWidth
  });

  //config.cache = { type: "memory", maxGenerations: 100 };
  config.cache = {
    type: "filesystem",
    name: `start_target-${target}_noexternal-${noexternal}`,
    buildDependencies: {
      config: [resolve(cwd, "./packi/webpack.filter.js")]
    }
  };

  warn(`\n`);
  warn(`>>>>------- IMPORTANT INFORMATION -------<<<<`);
  warn(`注意:`);
  warn(`由于react-refresh的兼容性问题, 请在安装了react-devtool插件的浏览器中调试网页, 否则react热更新不可用.`);
  warn(`具体原因: https://github.com/pmmmwh/react-refresh-webpack-plugin/issues/13`);
  warn(`由于Chrome插件市场被GFW屏蔽，建议使用微软的Edge浏览器, 可以直接安装react-devtool插件.`);
  warn(`>>>>-------------------------------------<<<<`);
  warn(`\n`);

  config = await filterConfig(cwd, config);

  const compiler = webpack(config);
  const entry = config.entry;
  let isDemo = false;

  if (entry && !Array.isArray(entry) && typeof entry !== "string" && !isFunction(entry)) {
    isDemo = ((entry as EntryObject).index as string).includes("demo");
  }

  const contentBase = isDemo ? "./demo/" : "./";

  //@ts-ignore
  const server = new WebpackDevServer(compiler, {
    contentBase,
    contentBasePublicPath: "/",
    liveReload: false,
    hot: true,
    compress: true,
    open: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    stats: {
      colors: true
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/g,
          to: (ctx: { parsedUrl: { href: string } }) => {
            const { href } = ctx.parsedUrl;

            if (!href) {
              return "/index.html";
            }

            const theExtname = extname(href);
            if ([".css", ".js", ".json", ".png", ".jpg", ".gif", ".svg"].indexOf(theExtname) !== -1) {
              return `/${basename(href)}`;
            }

            return "/index.html";
          }
        }
      ],
      verbose: true
    },
    before: (app: Application) => {
      const mocker = new Mocker(resolve(cwd, "./mock/index.js"));

      if (mocker.projectHasMockScript()) {
        mocker.bindExpressApp(app);
      }
    }
  });

  const prom: Promise<number> = new Promise((resolve, reject) => {
    server.listen(nRealPort, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(0);
    });
  });

  const ret = await prom;

  return ret;
}
