import { IUsecase, IUSER_REPOSITORY, IUserRepository } from '@app/domain';
import { IPasswordHashService } from '@app/infra/modules/password-hash/password-hash.service.interface';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInUserDto } from '../dto';
import { ErrorDefinitions } from '@app/domain/errors';
import { SignInUserResponse } from '../responses';
import { IGenerateTokenUser } from '../token/generate-token-user.inteface';

@Injectable()
export class SignInUserUseCase implements IUsecase {
  constructor(
    private readonly passwordHashService: IPasswordHashService,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly generateTokenUser: IGenerateTokenUser,
  ) {}

  async execute(params: SignInUserDto): Promise<SignInUserResponse> {
    const user = await this.userRepository.findOne({
      where: { email: params.email },
    });

    if (!user) {
      throw new UnauthorizedException({
        errorDefinition: ErrorDefinitions.USER_NOT_FOUND_OR_PASSWORD,
      });
    }

    const isPasswordValid = await this.passwordHashService.comparePassword(
      params.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        errorDefinition: ErrorDefinitions.USER_NOT_FOUND_OR_PASSWORD,
      });
    }

    const { token } = await this.generateTokenUser.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      id: user.id,
      name: user.name,
      token,
    };
  }
}
