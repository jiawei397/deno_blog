import { NotFoundException } from "oak_exception";
import {
  Controller,
  Form,
  Get,
  Params,
  Post,
  Query,
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
  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Get("/")
  async getAll(@Query("userId") userId: string, @Render() render: Render) {
    if (userId) {
      const posts = await this.postsService.findByUserId(userId, {
        isWithUserInfo: true,
      });
      return render("posts", {
        posts,
      });
    } else {
      const posts = await this.postsService.findAll({
        isWithUserInfo: true,
      });
      return render("posts", {
        posts,
      });
    }
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

  @Get("/:id")
  async findPostById(@Params("id") id: string, @Render() render: Render) {
    const post = await this.postsService.findById(id, {
      isWithUserInfo: true,
      isIncrementPv: true,
    });
    if (!post) {
      throw new NotFoundException(`未找到id为${id}的文章`);
    }
    return render("post", {
      post,
    });
  }
}
