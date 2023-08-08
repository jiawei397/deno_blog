import { Injectable } from "oak_nest";
import { InjectModel, Model } from "deno_mongo_schema";
import { Comment } from "./comments.schema.ts";
import { format } from "timeago";
import { Marked } from "markdown";
import { CreateCommentDto } from "./comments.dto.ts";

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment) private readonly model: Model<Comment>) {}

  create(params: CreateCommentDto) {
    return this.model.insertOne(params);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  async findByPostId(postId: string) {
    const arr = await this.model.findMany({
      postId,
    }, {
      populates: {
        author: true,
      },
    });
    arr.forEach((comment) => {
      comment.createdAt = format(comment.createTime, "zh_CN");
      const html = Marked.parse(comment.content);
      comment.contentHtml = html;
    });
    return arr;
  }

  findByPostIds(postIds: string[]) {
    return this.model.findMany({
      postId: {
        $in: postIds,
      },
    });
  }

  findById(id: string) {
    return this.model.findById(id);
  }
}
