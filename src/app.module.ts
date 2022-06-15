import { Module } from "oak_nest";
import { AppController } from "./app.controller.ts";
import { PostsModule } from "./posts/posts.module.ts";
import { UserModule } from "./user/user.module.ts";

@Module({
  imports: [
    UserModule,
    PostsModule,
  ],
  controllers: [
    AppController,
  ],
})
export class AppModule {}
