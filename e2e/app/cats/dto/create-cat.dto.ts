import { ApiExtension, ApiExtraModels, ApiProperty } from "@nestjs/swagger";

import { ExtraModel } from "./extra-model.dto";
import { LettersEnum } from "./pagination-query.dto";
import { TagDto } from "./tag.dto";

@ApiExtraModels(ExtraModel)
@ApiExtension("x-tags", ["foo", "bar"])
export class CreateCatDto {
  @ApiProperty()
  public readonly name: string;

  @ApiProperty({ minimum: 1, maximum: 200 })
  public readonly age: number;

  @ApiProperty({ name: "_breed", type: String })
  public readonly breed: string;

  @ApiProperty({
    format: "uri",
    type: [String],
  })
  public readonly tags?: string[];

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty({
    type: "string",
    isArray: true,
  })
  public readonly urls?: string[];

  @ApiProperty({
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
  public readonly options?: Record<string, any>[];

  @ApiProperty({
    description: "Enum with description",
  })
  public readonly enumWithDescription: LettersEnum;

  @ApiProperty({
    enum: LettersEnum,
    enumName: "LettersEnum",
  })
  public readonly enum: LettersEnum;

  @ApiProperty({
    enum: LettersEnum,
    enumName: "LettersEnum",
    isArray: true,
  })
  public readonly enumArr: LettersEnum;

  @ApiProperty({ description: "tag", required: false })
  public readonly tag: TagDto;

  public nested: {
    first: string;
    second: number;
  };
}
