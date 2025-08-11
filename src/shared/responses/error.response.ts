import { ApiProperty } from '@nestjs/swagger';
import { ErrorCode } from '@app/domain/enums';

/**
 * Standardized error response format
 */
export class ErrorResponse {
  @ApiProperty({ enum: ErrorCode, enumName: 'ErrorCode' })
  code: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  statusCodeAsString: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: () => [
      {
        property: String,
        messages: [String],
      },
    ],
    description: 'List of validation errors',
    required: false,
  })
  validatorErrors?: Array<{
    property: string;
    messages: string[];
  }>;
}
