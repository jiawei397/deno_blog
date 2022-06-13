import { Controller, Get } from "oak_nest";

@Controller("")
export class AppController {
  @Get("/")
  version() {
    return "hello world";
  }
}
