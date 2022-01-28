import path from "path";
import download from "download";
import { printPackageInfo, setPrintLevel, PRINT_LEVEL, error, warn, success } from "@packi_/printer";
import perf from "@packi_/utils/cjs/perf";
import getPackageJSON from "@packi_/utils/cjs/package/packageJSON";
import compareVersion from "@packi_/utils/cjs/version/compareVersion";
import getAction from "./getAction";

const PACKAGE_INFO_URL = "http://registry.npm.taobao.org/packi";

export class App {
  appArgs: string[];
  cwd: string;
  command: string;

  packageName = "";
  packageVersion = "";

  constructor(args: string[], cwd: string) {
    this.appArgs = args.slice(2);
    this.cwd = cwd;
    this.command = this.appArgs[0];

    if (this.appArgs.find(el => el === "-D")) {
      setPrintLevel(PRINT_LEVEL.DEBUG);
    } else {
      setPrintLevel(PRINT_LEVEL.INFO);
    }
  }

  async run(): Promise<number> {
    await this.prepare2Run();

    const end = perf("find action entry");
    const { command = "help" } = this;
    const cammandAction = await getAction(command);

    if (typeof cammandAction !== "function") {
      error(`Bad command: "${command}", packi can't load the command implemention.`);
      return 1;
    }

    end();

    let retCode = 0;

    try {
      const end = perf("run action");
      retCode = await cammandAction(this.cwd, ...this.appArgs);
      end();
    } catch (err) {
      error((err as Error)?.stack ?? (err as Error)?.message ?? err);
      retCode = 1;
    }

    if (!retCode) {
      success("Mission accomplished.");
    }

    return retCode;
  }

  private async prepare2Run() {
    try {
      const { name, version } = await getPackageJSON(path.resolve(__dirname, "../"));

      this.packageName = name as string;
      this.packageVersion = version as string;

      this.printAppInfo();
      this.checkVersion();
    } catch (err) {
      error((err as Error).message);
      error(`Try to continue...`);
    }
  }

  private printAppInfo() {
    printPackageInfo(this.packageName, this.packageVersion);
  }

  private async checkVersion() {
    const data = await download(PACKAGE_INFO_URL);
    const jsonText = data.toString("utf8");
    const schema = JSON.parse(jsonText);
    const latestVersion = schema["dist-tags"]["latest"];
    const version = this.packageVersion;

    if (compareVersion(latestVersion, version as string) > 0) {
      //if (onlineVersion !== version) {
      //存在新版本
      warn(`\n`);
      warn(`>>>>------- IMPORTANT INFORMATION -------<<<<`);
      warn(`A newer version(${latestVersion}) has been published.`);
      warn(`Please upgrade your local package(${version}) soon.`);
      warn(`>>>>-------------------------------------<<<<`);
      warn(`\n`);
    }
  }
}
