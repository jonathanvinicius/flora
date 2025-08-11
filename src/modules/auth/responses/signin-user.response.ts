import { ApiProperty } from '@nestjs/swagger';

export class SignInUserResponse {
  @ApiProperty({
    example: 'bddde997-e840-4223-8ade-f74c2a96cd3b',
  })
  id: string;

  @ApiProperty({
    example: 'john doe',
  })
  name: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
  })
  token: string;
}
