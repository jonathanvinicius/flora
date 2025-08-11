import { Injectable } from '@nestjs/common';
import { IAuthService } from './auth.service.interface';
import { SignInUserDto, SignUpUserDto } from './dto';
import { SignInUserUseCase, SignUpUserUseCase } from './usecases';
import { SignInUserResponse, SignUpUserResponse } from './responses';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly signInUserUseCase: SignInUserUseCase,
    private readonly signUpUserUseCase: SignUpUserUseCase,
  ) {}

  async signUpUser(params: SignUpUserDto): Promise<SignUpUserResponse> {
    return this.signUpUserUseCase.execute(params);
  }

  async signInUser(params: SignInUserDto): Promise<SignInUserResponse> {
    return this.signInUserUseCase.execute(params);
  }
}
