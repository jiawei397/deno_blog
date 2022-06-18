import { Module } from "oak_nest";
import { CommentsController } from "./comments.controller.ts";

@Module({
  controllers: [
    CommentsController,
  ],
})
export class CommentsModule {
}
