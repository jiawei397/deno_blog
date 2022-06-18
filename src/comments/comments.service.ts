import { Injectable } from "oak_nest";
import { InjectModel, Model } from "../model.ts";
import { UserService } from "../user/user.service.ts";
import { Comment } from "./comments.schema.ts";
import { format } from "timeago";
import { Marked } from "markdown";
import { CreateCommentDto } from "./comments.dto.ts";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) private readonly model: Model<Comment>,
    private readonly userService: UserService,
  ) {
  }

  create(params: CreateCommentDto) {
    const now = new Date();
    return this.model.insertOne({
      ...params,
      createTime: now,
      updateTime: now,
    });
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async findByPostId(postId: string) {
    const arr = await this.model.findMany({
      postId,
    });
    const userIds = arr.map((item) => item.userId);
    const users = await this.userService.getUsersByIds(userIds);
    arr.forEach((comment) => {
      comment.createdAt = format(comment.createTime, "zh_CN");
      const html = Marked.parse(comment.content).content;
      comment.contentHtml = html;
      comment.author = users.find((user) => user.id === comment.userId);
    });
    return arr;
  }

  findById(id: string) {
    return this.model.findById(id);
  }
}
