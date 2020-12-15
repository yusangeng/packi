import fs from "fs";
import path from "path";
import ejs from "ejs";
import walk from "fs-walk";
import { debug, info, error } from "packi-print";

export type InitOptions = {
  projectName: string;
  target: "web" | "mobile";
};

export default function fillTemplate(cwd: string, options: InitOptions) {
  info(`Filling EJS templates, basedir="${cwd}"...`);

  return new Promise<void>((resolve, reject) => {
    walk.walk(
      cwd,
      (basedir: string, filename: string, stat: any, next: () => void) => {
        if (stat.isDirectory()) {
          return next();
        }

        const filepath = path.resolve(basedir, filename);
        const extname = path.extname(filepath);

        if (
          ![".js", ".jsx", ".ts", ".tsx", ".md", ".json", "css", "less", "sass", "scss", ".html", "vue"].includes(
            extname
          )
        ) {
          return next();
        }

        debug(`Filling EJS template: ${filepath}`);

        try {
          let data = fs.readFileSync(filepath, { encoding: "utf8" });
          data = ejs.compile(data)(options);
          fs.writeFileSync(filepath, data, { encoding: "utf8" });
        } catch (err) {
          error(err.message);
        }

        next();
      },
      (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(void 0);
        }
      }
    );
  });
}
