import { MongoFactory } from "deno_mongo_schema";
import { Module } from "oak_nest";
import { AppController } from "./app.controller.ts";
import { CommentsModule } from "./comments/comments.module.ts";
import globals from "./globals.ts";
import { PostsModule } from "./posts/posts.module.ts";
import { UserModule } from "./user/user.module.ts";

@Module({
  imports: [
    MongoFactory.forRoot(globals.db),
    UserModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}
