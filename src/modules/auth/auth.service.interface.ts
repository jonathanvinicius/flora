import { Injectable } from '@nestjs/common';
import { SignInUserDto, SignUpUserDto } from './dto';
import { SignInUserResponse, SignUpUserResponse } from './responses';

@Injectable()
export abstract class IAuthService {
  /**
   * Signin user and return tokens
   */
  abstract signInUser(params: SignInUserDto): Promise<SignInUserResponse>;

  abstract signUpUser(params: SignUpUserDto): Promise<SignUpUserResponse>;
}
