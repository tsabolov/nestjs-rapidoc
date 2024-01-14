import { ApiProperty } from "@nestjs/swagger";

export class ExtraModel {
  @ApiProperty()
  public readonly one: string;

  @ApiProperty()
  public readonly two: number;
}
