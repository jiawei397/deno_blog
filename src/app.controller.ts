import { Controller, Get } from "oak_nest";
import { readYaml } from "./tools/utils.ts";

@Controller("")
export class AppController {
  @Get("/")
  async version() {
    const scriptsConfig = await readYaml<{ version: string }>("scripts.yml");
    return `<html><h2>${scriptsConfig.version}</h2></html>`;
  }
}
