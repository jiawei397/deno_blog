// deno-lint-ignore-file no-explicit-any
import { getLogger, initLog } from "date_file_log";
import globals from "../globals.ts";
import { Injectable, Reflect } from "@nest";

await initLog(globals.log);

export const logger = getLogger();

@Injectable({
  singleton: false,
})
export class Logger {
  constructor() {
    this.debug = this.debug.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
  }
  private get pre() {
    const parent = Reflect.getMetadata("meta:container", this);
    return parent?.name;
  }

  protected write(
    methodName: "warning" | "info" | "debug" | "error",
    ...messages: any[]
  ): void {
    if (this?.pre) {
      logger[methodName](this.pre, ...messages);
    } else {
      const [first, ...others] = messages;
      logger[methodName](first, ...others);
    }
  }

  debug(...messages: any[]): void {
    this.write("debug", ...messages);
  }

  info(...messages: any[]) {
    this.write("info", ...messages);
  }

  warn(...messages: any[]) {
    this.write("warning", ...messages);
  }

  error(...messages: any[]) {
    this.write("error", ...messages);
  }
}
