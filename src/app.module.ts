import { APP_INTERCEPTOR, Module } from "@nest";
import { MongoModule } from "@nest/mongo";
import { AppController } from "./app.controller.ts";
import { CommentsModule } from "./comments/comments.module.ts";
import globals from "./globals.ts";
import { PostsModule } from "./posts/posts.module.ts";
import { UserModule } from "./user/user.module.ts";
import { SessionModule } from "@/session/session.module.ts";

@Module({
  imports: [
    MongoModule.forRoot(globals.db),
    SessionModule,
    UserModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
