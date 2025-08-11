import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IAuthService } from './auth.service.interface';
import { SignInUserDto, SignUpUserDto } from './dto';
import {
  ApiAuthErrorResponse,
  ApiDataResponse,
  Public,
} from '@app/shared/decorators';
import { SignInUserResponse, SignUpUserResponse } from './responses';

@Public()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: IAuthService) {}

  @ApiDataResponse({
    type: SignInUserResponse,
    status: HttpStatus.OK,
    description:
      'Returns an authentication token after successfully creating a new user account.',
  })
  @ApiAuthErrorResponse()
  @ApiOperation({
    summary: 'User registration',
    description:
      'Creates a new user account with the provided credentials and returns an authentication token.',
    operationId: 'postSignUpUser',
  })
  @Post('/signup')
  signUpUser(@Body() body: SignUpUserDto): Promise<SignUpUserResponse> {
    return this.service.signUpUser(body);
  }

  @ApiDataResponse({
    type: SignInUserResponse,
    status: HttpStatus.OK,
    description: 'Returns an authentication token after successful login.',
  })
  @ApiAuthErrorResponse()
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates a user with email/username and password, returning an authentication token.',
    operationId: 'postSignInUser',
  })
  @Post('/signin')
  signInUser(@Body() body: SignInUserDto): Promise<SignInUserResponse> {
    return this.service.signInUser(body);
  }
}
