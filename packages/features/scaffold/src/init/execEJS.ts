import fs from "fs";
import path from "path";
import ejs from "ejs";
import walk, { WalkNext, WalkStats } from "walk";
import { info, error } from "@packi_/printer";

const extnames = [".js", ".jsx", ".ts", ".tsx", ".md", ".json", ".css", ".less", ".sass", ".scss", ".html", ".vue"];

export type InitOptions = {
  projectName: string;
  target: "web" | "mobile";
};

export default function fillTemplate(cwd: string, options: InitOptions): Promise<unknown> {
  info(`Filling EJS templates, basedir="${cwd}"...`);

  return new Promise(resolve => {
    const walker = walk.walk(cwd);

    walker.on("directories", function (root, dirStatsArray, next) {
      // dirStatsArray is an array of `stat` objects with the additional attributes
      // * type
      // * error
      // * name

      function removeDirs(...removeNames: string[]) {
        removeNames.forEach(el => {
          const index = dirStatsArray.findIndex(node => {
            return node.name === el;
          });

          if (index >= 0) {
            dirStatsArray.splice(index, 1);
          }
        });
      }

      removeDirs("node_modules", ".git", ".github", ".publish", ".coverage");
      next();
    });

    walker.on("directory", (basedir: string, stats: WalkStats, next: WalkNext) => {
      next();
    });

    walker.on("file", (basedir: string, stats: WalkStats, next: WalkNext) => {
      const filepath = path.resolve(basedir, stats.name);
      const extname = path.extname(filepath);

      if (filepath.includes("node_modules") || filepath.includes(".git") || !extnames.includes(extname)) {
        return next();
      }

      info(`Find template file: ${filepath}`);

      try {
        let data = fs.readFileSync(filepath, { encoding: "utf8" });
        data = ejs.compile(data)(options);

        // fixme: 临时方案, 专门用来应对模板参数作为包名时，在脚手架根目录无法直接运行npm install等命令的问题
        if (data) {
          data = data.replace(/--project-name--/g, options.projectName); //modify by wangjx 2021-2-4 添加判断
        }

        fs.writeFileSync(filepath, data, { encoding: "utf8" });
      } catch (err) {
        error((err as any).message ?? err);
      }

      next();
    });

    walker.on("errors", (basedir: string, state: WalkStats[], next: WalkNext) => {
      console.error(state);
      next();
    });

    walker.on("end", function () {
      resolve(null);
    });
  });
}
