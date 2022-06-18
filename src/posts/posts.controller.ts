import {
  Controller,
  Form,
  Get,
  Post,
  Res,
  Response,
  UseGuards,
} from "oak_nest";
import { SSOGuard } from "../guards/sso.guard.ts";
import { Flash, UserParam } from "../session/session.decorator.ts";
import { Render } from "../tools/ejs.ts";
import { UserInfo } from "../user/user.schema.ts";
import { CreatePostDto } from "./posts.dto.ts";
import { PostsService } from "./posts.service.ts";

@Controller("/posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get("/")
  async getAll(@Render() render: Render) {
    return await render("posts", {});
  }

  @Get("/create")
  @UseGuards(SSOGuard)
  createPage(@Render() render: Render) {
    return render("posts/create", {});
  }

  @UseGuards(SSOGuard)
  @Post("/")
  async createBlog(
    @Form() params: CreatePostDto,
    @Res() res: Response,
    @UserParam() userInfo: UserInfo,
    @Flash() flash: Flash,
  ) {
    params.userId = userInfo.id;
    const id = await this.postsService.save(params);
    flash("success", "发表成功");
    // 发表成功后跳转到该文章页
    res.redirect(`/posts/${id}`);
  }
}
