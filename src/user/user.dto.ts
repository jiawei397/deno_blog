import { IsNumber, IsString, Min } from "../../deps.ts";

export class CreateUserDto {
  @IsString()
  author: string;

  @IsNumber()
  @Min(0)
  age: number;
}
