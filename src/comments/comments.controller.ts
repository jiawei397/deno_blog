import { BadRequestException, ForbiddenException } from "oak_exception";
import {
  Controller,
  Form,
  Get,
  Params,
  Post,
  REDIRECT_BACK,
  Res,
  type Response,
  UseGuards,
} from "@nest";
import { SSOGuard } from "../guards/sso.guard.ts";
import { Flash, UserParam } from "../session/session.decorator.ts";
import { Logger } from "../tools/log.ts";
import type { UserInfo } from "../user/user.schema.ts";
import { CreateCommentDto } from "./comments.dto.ts";
import { CommentsService } from "./comments.service.ts";

@Controller("/posts")
@UseGuards(SSOGuard)
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly logger: Logger,
  ) {}

  @Post("/:postId/comment")
  async createComment(
    @Params("postId") postId: string,
    @Form() params: CreateCommentDto,
    @Res() res: Response,
    @UserParam() userInfo: UserInfo,
    @Flash() flash: Flash,
  ) {
    const id = await this.commentsService.create({
      postId,
      userId: userInfo.id,
      content: params.content,
    });
    this.logger.info(`用户${userInfo.id}创建了博客${postId}的留言: ${id}`);
    flash("success", "留言成功");
    // 留言成功后跳转到上一页
    res.redirect(REDIRECT_BACK);
  }

  @Get("/:postId/comment/:commentId/remove")
  async removeComment(
    @Params("postId") postId: string,
    @Params("commentId") commentId: string,
    @UserParam() user: UserInfo,
    @Res() res: Response,
    @Flash() flash: Flash,
  ) {
    const comment = await this.commentsService.findById(commentId);
    if (!comment) {
      throw new BadRequestException(`未找到id为${commentId}的留言`);
    }
    if (comment.userId !== user.id) {
      throw new ForbiddenException(`您没有权限删除该留言`);
    }
    await this.commentsService.deleteById(commentId);
    this.logger.info(
      `用户${user.id}删除了博客${postId}的留言：${commentId}`,
    );
    flash("success", "删除留言成功");
    res.redirect(REDIRECT_BACK);
  }
}
