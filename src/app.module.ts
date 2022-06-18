import { Module } from "oak_nest";
import { AppController } from "./app.controller.ts";
import { CommentsModule } from "./comments/comments.module.ts";
import { PostsModule } from "./posts/posts.module.ts";
import { UserModule } from "./user/user.module.ts";

@Module({
  imports: [
    UserModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}
