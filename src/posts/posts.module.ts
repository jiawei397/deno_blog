import { Module } from "@nest";
import { PostsController } from "./posts.controller.ts";

@Module({
  controllers: [
    PostsController,
  ],
})
export class PostsModule {
}
