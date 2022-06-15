import { Controller, Get } from "oak_nest";
import { render } from "./tools/ejs.ts";
import { Logger } from "./tools/log.ts";
import { readYaml } from "./tools/utils.ts";

@Controller("")
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get("/")
  async version() {
    const scriptsConfig = await readYaml<{ version: string }>("scripts.yml");
    const version = scriptsConfig.version;
    this.logger.info(`version: ${version}`);
    return render("index", {
      version,
    });
  }
}
