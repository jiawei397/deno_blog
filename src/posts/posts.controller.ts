import { Controller, Get, UseGuards } from "oak_nest";
import { SSOGuard } from "../guards/sso.guard.ts";
import { Render } from "../tools/ejs.ts";

@Controller("/posts")
export class PostsController {
  @Get("/")
  async getAll(@Render() render: Render) {
    return await render("posts", {});
  }

  @Get("/create")
  @UseGuards(SSOGuard)
  createPage(@Render() render: Render) {
    return render("posts/create", {});
  }
}
