import fs from "fs";
import path from "path";
import fileExists from "file-exists";
import userHome from "user-home";
import merge from "lodash.merge";

type ContextProps<T = {}> = { settingFilename: string; defaultSettings: T };

export default class Context<T> {
  defaultSettings: T;
  absoluteFilename: string;
  cache: any = null;

  constructor({ settingFilename, defaultSettings }: ContextProps<T>) {
    this.defaultSettings = defaultSettings;
    this.absoluteFilename = path.resolve(userHome, settingFilename);
    this.read();
    this.write({});
  }

  read(): T {
    const { absoluteFilename, cache } = this;

    if (cache) {
      return cache;
    }

    let fileContent: T | null = null;

    if (fileExists.sync(absoluteFilename)) {
      const jsonData = fs.readFileSync(absoluteFilename, { encoding: "utf8" });

      try {
        fileContent = JSON.parse(jsonData);
      } catch (err) {
        return this.defaultSettings;
      }
    }

    this.cache = merge({}, this.defaultSettings, fileContent);

    return this.cache;
  }

  write(data: Partial<T>): void {
    const content = merge(this.cache, data);

    fs.writeFileSync(this.absoluteFilename, JSON.stringify(content, null, 2), {
      encoding: "utf8"
    });

    this.cache = content;
  }
}
