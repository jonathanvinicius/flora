import { IUsecase, IUSER_REPOSITORY, IUserRepository } from '@app/domain';
import { Inject, Injectable } from '@nestjs/common';
import { GetUserMeResponse } from '../responses/get-user-me.response';

@Injectable()
export class GetUserMeUseCase implements IUsecase {
  constructor(
    @Inject(IUSER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<GetUserMeResponse> {
    return this.userRepository.findOne({
      where: { id: userId },
      attributes: ['id', 'name', 'email'],
    });
  }
}
