import { Controller, Get } from "oak_nest";
import { render } from "../tools/ejs.ts";

@Controller("/posts")
export class PostsController {
  @Get("/")
  async getAll() {
    return await render("posts", {});
  }
}
