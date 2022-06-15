import { Controller, Get } from "oak_nest";
import { Render } from "../tools/ejs.ts";

@Controller("/posts")
export class PostsController {
  @Get("/")
  async getAll(@Render() render: Render) {
    return await render("posts", {});
  }
}
