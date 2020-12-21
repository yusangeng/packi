import Context from "packi-settings";

type S = {
  templates: {
    [name: string]: string;
  };
  start: {
    port: number;
  };
  npmpub: {
    registry: string;
  };
};

const context = new Context<S>({
  settingFilename: ".packi.json",
  defaultSettings: {
    templates: {
      lib: "https://github.com/yusangeng/packi-template-tslib/archive/master.zip",
      web: "https://github.com/yusangeng/packi-template-web/archive/master.zip",
      component: "https://github.com/yusangeng/packi-template-component/archive/master.zip"
    },
    start: {
      port: 3210
    },
    npmpub: {
      registry: "https://registry.npmjs.org"
    }
  }
});

export function read() {
  return context.read();
}

export function write(data: S) {
  return context.write(data);
}
