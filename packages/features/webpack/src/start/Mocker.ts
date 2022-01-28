import { statSync } from "fs";
import { Application } from "express";
import apiMocker from "mocker-api";
import { error, info } from "@packi_/printer";

export default class Mocker {
  private mockFilename: string;
  private hasMockScriptCache = false;

  constructor(mockFilename: string) {
    this.mockFilename = mockFilename;
  }

  async initialize(): Promise<boolean> {
    if (!this.projectHasMockScript()) {
      return false;
    }

    return true;
  }

  bindExpressApp(app: Application): void {
    try {
      apiMocker(app, this.mockFilename);
    } catch (err) {
      error(`Load mock script error: ${(err as Error).message}`);
    }
  }

  projectHasMockScript(): boolean {
    try {
      this.hasMockScriptCache = statSync(this.mockFilename).isFile();
    } catch (err) {
      this.hasMockScriptCache = false;
    }

    if (this.hasMockScriptCache) {
      info(`Find mock script: ${this.mockFilename}`);
    }

    return this.hasMockScriptCache;
  }
}
