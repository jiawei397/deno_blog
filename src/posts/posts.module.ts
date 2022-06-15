import { Module } from "oak_nest";
import { PostsController } from "./posts.controller.ts";

@Module({
  controllers: [
    PostsController,
  ],
})
export class PostsModule {
}
