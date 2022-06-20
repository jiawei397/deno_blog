import { Injectable } from "oak_nest";
import { InjectModel, Model, ModelWithId } from "../model.ts";
import { Logger } from "../tools/log.ts";
import { UserService } from "../user/user.service.ts";
import { CreatePostDto, UpdatePostDto } from "./posts.dto.ts";
import { Post } from "./posts.schema.ts";
import { format } from "timeago";
import { Marked } from "markdown";
import { CommentsService } from "../comments/comments.service.ts";

interface PopulateOptions {
  isWithUserInfo?: boolean;
  isWithComments?: boolean;
  isIncrementPv?: boolean;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly model: Model<Post>,
    private readonly userService: UserService,
    private readonly commentsService: CommentsService,
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
    if (options.isWithComments) {
      post.comments = await this.commentsService.findByPostId(id);
      post.commentsCount = post.comments.length;
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

  async findAll(options: PopulateOptions = {}) {
    const posts = await this.model.findAll();
    await this.formatPosts(posts, options);
    return posts;
  }

  private async formatPosts(
    posts: ModelWithId<Post>[],
    options: PopulateOptions = {},
  ) {
    if (options.isWithUserInfo) {
      const users = await this.userService.getUsersByIds(
        posts.map((post) => post.userId),
      );
      posts.forEach((post) => {
        post.author = users.find((user) => user.id === post.userId);
      });
    }
    if (options.isWithComments) {
      const comments = await this.commentsService.findByPostIds(
        posts.map((post) => post.id),
      );
      posts.forEach((post) => {
        post.comments = comments.filter((comment) =>
          comment.postId === post.id
        );
        post.commentsCount = post.comments.length;
      });
    }
    // 增加浏览次数
    if (options.isIncrementPv) {
      posts.forEach((post) => {
        this.model.findByIdAndUpdate(post.id, {
          pv: post.pv + 1,
        }).catch(this.logger.error);
      });
    }
    posts.forEach((post) => {
      this.format(post);
    });
    posts.sort((a, b) => {
      if (a.createTime > b.createTime) {
        return -1;
      }
      return 1;
    });
  }

  async findByUserId(userId: string, options: PopulateOptions = {}) {
    const posts = await this.model.findMany({
      userId,
    });
    await this.formatPosts(posts, options);
    return posts;
  }

  update(id: string, params: UpdatePostDto) {
    return this.model.findByIdAndUpdate(id, params);
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
