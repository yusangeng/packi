/**
 * 入口文件
 *
 * @author yusangeng@outlook.com
 */

import Context from "@packi_/settings";

type S = {
  templates: {
    [name: string]: string;
  };
  start: {
    port: number;
    cache: boolean;
    noexternal: boolean;
    externals: {
      [k: string]: string;
    };
  };
  npmpub: {
    registry: string;
  };
  make: {
    noexternal: boolean;
    cache: boolean;
    externals: {
      [k: string]: string;
    };
  };
};

const context = new Context<S>({
  settingFilename: ".packirc",
  defaultSettings: {
    templates: {
      cli: "https://github.com/yusangeng/packi-template-cli/archive/refs/heads/master.zip",
      tslib: "https://github.com/yusangeng/packi-template-tslib/archive/refs/heads/master.zip"
    },
    start: {
      port: 3210,
      cache: true,
      noexternal: false,
      externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router-dom": "ReactRouterDOM"
      }
    },
    make: {
      cache: true,
      noexternal: false,
      externals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router-dom": "ReactRouterDOM"
      }
    },
    npmpub: {
      registry: "https://registry.npmjs.com"
    }
  }
});

export function read(): S {
  return context.read();
}

export function write(data: S): void {
  return context.write(data);
}
