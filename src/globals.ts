import { readYaml } from "./tools/utils.ts";
import { DateFileLogConfig } from "date_file_log";

export interface Config {
  port: number;
  meta: {
    title: string;
    description: string;
  };
  log: DateFileLogConfig;
}

const config = await readYaml<Config>("config/server.yaml");
if (!config) {
  console.error("not read config/server.yaml");
  Deno.exit(1);
}

export default config;
