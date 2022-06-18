import { Injectable } from "oak_nest";
import { InjectModel, Model } from "../model.ts";
import { Logger } from "../tools/log.ts";
import { UserService } from "../user/user.service.ts";
import { CreatePostDto } from "./posts.dto.ts";
import { Post } from "./posts.schema.ts";
import { format } from "timeago";
import { Marked } from "markdown";

interface PopulateOptions {
  isWithUserInfo?: boolean;
  isIncrementPv?: boolean;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly model: Model<Post>,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  save(params: CreatePostDto): Promise<string> {
    const now = new Date();
    return this.model.insertOne({
      ...params,
      pv: 0,
      createTime: now,
      updateTime: now,
    });
  }

  async findById(id: string, options: PopulateOptions = {}) {
    const post = await this.model.findById(id);
    if (!post) {
      return;
    }
    if (options.isWithUserInfo) {
      post.author = await this.userService.getUserById(post.userId);
    }
    // 增加浏览次数
    if (options.isIncrementPv) {
      this.model.findByIdAndUpdate(id, {
        pv: post.pv + 1,
      }).catch(this.logger.error);
    }
    this.format(post);
    return post;
  }

  private format(post: Post) {
    post.createdAt = format(post.createTime, "zh_CN");
    const html = Marked.parse(post.content).content;
    post.contentHtml = html;
  }
}
