import { ForbiddenException, NotFoundException } from "oak_exception";
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
import { CreatePostDto, UpdatePostDto } from "./posts.dto.ts";
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

  @UseGuards(SSOGuard)
  @Get("/:id/edit")
  async editPage(@Params("id") id: string, @Render() render: Render) {
    const post = await this.postsService.findById(id, {
      isWithUserInfo: true,
    });
    return render("posts/edit", { post });
  }

  @Post("/:id/edit")
  @UseGuards(SSOGuard)
  async updatePost(
    @Params("id") id: string,
    @Form() params: UpdatePostDto,
    @Res() res: Response,
    @Flash() flash: Flash,
  ) {
    await this.postsService.update(id, params);
    flash("success", "更新成功");
    // 编辑成功后跳转到文章页面
    res.redirect("/posts/" + id);
  }

  @UseGuards(SSOGuard)
  @Get("/:id/remove")
  async remove(
    @Params("id") id: string,
    @UserParam() user: UserInfo,
    @Res() res: Response,
    @Flash() flash: Flash,
  ) {
    const post = await this.postsService.findById(id);
    if (!post) {
      throw new NotFoundException(`未找到id为${id}的博客`);
    }
    if (post.userId !== user.id) {
      throw new ForbiddenException(`您没有权限删除该博客`);
    }
    await this.postsService.deleteById(id);

    flash("success", "删除成功");
    // 删除成功后跳转到主页
    res.redirect("/posts");
  }
}
