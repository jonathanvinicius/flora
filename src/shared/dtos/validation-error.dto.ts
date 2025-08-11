import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorItem {
  @ApiProperty()
  property: string;

  @ApiProperty({ type: [String] })
  messages: string[];
}
