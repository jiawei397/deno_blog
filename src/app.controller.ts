import { Controller, Get, Res, Response } from "oak_nest";
import { Render } from "./tools/ejs.ts";
import { Logger } from "./tools/log.ts";
import { readYaml } from "./tools/utils.ts";

@Controller("")
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get("/version")
  async version(@Render() render: Render) {
    const scriptsConfig = await readYaml<{ version: string }>("scripts.yml");
    const version = scriptsConfig.version;
    this.logger.info(`version: ${version}`);
    return render("index", {
      version,
    });
  }

  @Get("/")
  index(@Res() res: Response) {
    res.redirect("/posts");
  }
}
