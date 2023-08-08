import { Injectable } from "oak_nest";
import { InjectModel, Model } from "deno_mongo_schema";
import { Logger } from "../tools/log.ts";
import { CreatePostDto, UpdatePostDto } from "./posts.dto.ts";
import { Post } from "./posts.schema.ts";
import { format } from "timeago";
import { Marked } from "markdown";
import { CommentsService } from "../comments/comments.service.ts";

interface PopulateOptions {
  isWithUserInfo?: boolean;
  isWithComments?: boolean;
  isWithCommentsCount?: boolean;
  isIncrementPv?: boolean;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly model: Model<Post>,
    private readonly commentsService: CommentsService,
    private readonly logger: Logger,
  ) {}

  async save(params: CreatePostDto): Promise<string> {
    const id = await this.model.insertOne({
      ...params,
      pv: 0,
    });
    return id.toString();
  }

  async findById(id: string, options: PopulateOptions = {}) {
    const post = await this.model.findById(id, {
      populates: this.getPopulates(options),
    });
    if (!post) {
      return;
    }
    if (options.isWithComments) {
      post.comments = await this.commentsService.findByPostId(id);
      post.commentsCount = post.comments.length;
    }
    // 增加浏览次数
    if (options.isIncrementPv) {
      this.incrementPvById(id).catch(this.logger.error);
    }
    this.format(post);
    return post;
  }

  private incrementPvById(id: string) {
    return this.model.findByIdAndUpdate(id, {
      $inc: {
        pv: 1,
      },
    });
  }

  private incrementPvByIds(ids: string[]) {
    return this.model.updateMany({
      id: {
        $in: ids,
      },
    }, {
      $inc: {
        pv: 1,
      },
    });
  }

  private getPopulates(options?: PopulateOptions) {
    if (!options) {
      return;
    }
    const populates: Record<string, boolean> = {};
    if (options.isWithUserInfo) {
      populates["author"] = true;
    }
    if (options.isWithCommentsCount) {
      populates["commentsCount"] = true;
    }
    return populates;
  }

  private format(post: Post) {
    post.createdAt = format(post.createTime!, "zh_CN");
    const html = Marked.parse(post.content);
    post.contentHtml = html;
  }

  async findAll(options: PopulateOptions = {}) {
    const posts = await this.model.findMany({}, {
      populates: this.getPopulates(options),
      sort: {
        createTime: -1,
      },
    });
    this.formatPosts(posts, options);
    return posts;
  }

  private formatPosts(
    posts: Required<Post>[],
    options: PopulateOptions = {},
  ) {
    // 增加浏览次数
    if (options.isIncrementPv) {
      this.incrementPvByIds(posts.map((post) => post.id)).catch(
        this.logger.error,
      );
    }
    posts.forEach((post) => {
      this.format(post);
    });
  }

  async findByUserId(userId: string, options: PopulateOptions = {}) {
    const posts = await this.model.findMany({
      userId,
    }, {
      populates: this.getPopulates(options),
      sort: {
        createTime: -1,
      },
    });
    this.formatPosts(posts, options);
    return posts;
  }

  update(id: string, params: UpdatePostDto) {
    return this.model.findByIdAndUpdate(id, params);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
