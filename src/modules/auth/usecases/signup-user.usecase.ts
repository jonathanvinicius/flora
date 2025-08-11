import { IUsecase, IUSER_REPOSITORY, IUserRepository } from '@app/domain';
import { IPasswordHashService } from '@app/infra/modules/password-hash/password-hash.service.interface';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignUpUserDto } from '../dto';
import { ErrorDefinitions } from '@app/domain/errors';
import { SignUpUserResponse } from '../responses';
import { IGenerateTokenUser } from '../token/generate-token-user.inteface';

@Injectable()
export class SignUpUserUseCase implements IUsecase {
  constructor(
    private readonly passwordHashService: IPasswordHashService,
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly generateTokenUser: IGenerateTokenUser,
  ) {}

  async execute(params: SignUpUserDto): Promise<SignUpUserResponse> {
    const userExist = await this.userRepository.findOne({
      where: { email: params.email },
    });

    if (userExist) {
      throw new UnprocessableEntityException({
        errorDefinition: ErrorDefinitions.USER_EXISTS,
      });
    }

    const hashPassword = await this.passwordHashService.hashPassword(
      params.password,
    );

    const user = await this.userRepository.create({
      name: params.name,
      email: params.email,
      password: hashPassword,
    });

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
