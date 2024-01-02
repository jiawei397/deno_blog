import { Controller, Get, Res, type Response } from "@nest";
import { Render } from "./tools/ejs.ts";
import { Logger } from "./tools/log.ts";
import { parse } from "jsonc";

@Controller("")
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get("/version")
  async version(@Render() render: Render) {
    const text = await Deno.readTextFile("deno.jsonc");
    const json: { version: string } = parse(text);
    const { version } = json;
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
