import { readYaml } from "./tools/utils.ts";

export interface Config {
  port: number;
}

const config = await readYaml<Config>("config/server.yaml");
if (!config) {
  console.error("not read config/server.yaml");
  Deno.exit(1);
}

export default config;
