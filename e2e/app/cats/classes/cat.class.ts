import { ApiProperty } from "@nestjs/swagger";

import { LettersEnum } from "../dto/pagination-query.dto";

export class Cat {
  @ApiProperty({ example: "Kitty", description: "The name of the Cat" })
  public name: string;

  @ApiProperty({ example: 1, minimum: 0, description: "The age of the Cat" })
  public age: number;

  @ApiProperty({
    example: "Maine Coon",
    description: "The breed of the Cat",
  })
  public breed: string;

  @ApiProperty({
    name: "_tags",
    type: [String],
  })
  public tags?: string[];

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  public urls?: string[];

  @ApiProperty({
    name: "_options",
    type: "array",
    items: {
      type: "object",
      properties: {
        isReadonly: {
          type: "string",
        },
      },
    },
  })
  public options?: Record<string, any>[];

  @ApiProperty({
    enum: LettersEnum,
  })
  public enum: LettersEnum;

  @ApiProperty({
    enum: LettersEnum,
    isArray: true,
  })
  public enumArr: LettersEnum;
}
