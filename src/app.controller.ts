import { Controller, Get } from "oak_nest";
import { Logger } from "./tools/log.ts";
import { readYaml } from "./tools/utils.ts";

@Controller("")
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get("/")
  async version() {
    const scriptsConfig = await readYaml<{ version: string }>("scripts.yml");
    this.logger.info(`version: ${scriptsConfig.version}`);
    return `<html><h2>${scriptsConfig.version}</h2></html>`;
  }
}
