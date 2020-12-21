import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import { declareAction, info, error, warn } from "packi-print";
import defaultConfig from "~/libs/webpackHelper/defaultConfig";
import filterConfig from "~/libs/webpackHelper/filterConfig";
import { read } from "~/settings";
import cah from "command-arguments-helper";

export default function start(cwd: string, appName: string, ...rest: string[]) {
  const realArgs = cah<[string, "web" | "mobile"]>(["port", "target"], rest);

  return start_(cwd, appName, ...realArgs);
}

async function start_(cwd: string, appName: string, port: string, target: "web" | "mobile" = "web"): Promise<number> {
  declareAction("start", `launch dev server at ${port}.`);

  const globalData = read();
  const globalDataPort = globalData.start.port;

  let nPort: any = port ?? globalDataPort;
  nPort = parseInt("" + nPort);

  if (!nPort || Number.isNaN(nPort)) {
    throw new Error(`The server port(${port}) is illegal.`);
  }

  info(`Host: http://127.0.0.1:${nPort}`);

  // 如果是start，要优先查找demo，但是make要优先查找src
  let config = defaultConfig({
    cwd,
    mode: "dev",
    entrySearchDirs: ["./", "./demo/", "./src/"],
    isMobile: target === "mobile"
  });
  config.plugins!.push(new webpack.HotModuleReplacementPlugin());
  config = await filterConfig(cwd, config);

  const isDemo = (config as any).entry.index.includes("demo");

  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    contentBase: isDemo ? "./demo/" : "./",
    contentBasePublicPath: "/",
    liveReload: true,
    compress: true,
    stats: {
      colors: true
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/g,
          to: ctx => {
            const { href } = ctx.parsedUrl;
            console.log(href);

            if (!href) {
              return "/index.html";
            }

            return "/index.html";
          }
        }
      ],
      verbose: true
    }
  });

  const prom: Promise<number> = new Promise((resolve, reject) => {
    server.listen(nPort, (err?: Error) => {
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
