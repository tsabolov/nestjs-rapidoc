import { ApiProperty } from "@nestjs/swagger";

export enum LettersEnum {
  A = "A",
  B = "B",
  C = "C",
}

export class PaginationQuery {
  @ApiProperty({
    minimum: 0,
    maximum: 10000,
    title: "Page",
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    format: "int32",
    default: 0,
  })
  public page: number;

  @ApiProperty({
    name: "_sortBy",
    nullable: true,
  })
  public sortBy: string[];

  @ApiProperty()
  public limit: number;

  @ApiProperty({
    enum: LettersEnum,
    enumName: "LettersEnum",
  })
  public enum: LettersEnum;

  @ApiProperty({
    enum: LettersEnum,
    enumName: "LettersEnum",
    isArray: true,
  })
  public enumArr: LettersEnum[];

  @ApiProperty({
    enum: LettersEnum,
    enumName: "Letter",
    isArray: true,
  })
  public letters: LettersEnum[];

  @ApiProperty()
  public beforeDate: Date;

  @ApiProperty({
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      age: {
        type: "number",
      },
    },
    additionalProperties: true,
  })
  public filter: Record<string, any>;

  public static _OPENAPI_METADATA_FACTORY() {
    return {
      sortBy: { type: () => [String] },
    };
  }
}
