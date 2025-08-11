import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { IPasswordHashService } from '@app/infra/modules/password-hash/password-hash.service.interface';
import { ErrorDefinitions } from '@app/domain/errors';
import { SignInUserUseCase } from '../signin-user.usecase';
import { IGenerateTokenUser } from '../../token/generate-token-user.inteface';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { ConfigMock } from '@app/infra/config/config.mock';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import { UserDataModule } from '@app/infra/database/contexts';
import { createUserResponse } from '@app/infra/database/contexts/relational/_fakers_';
import { createPasswordHashServiceMock } from '@app/infra/modules/password-hash/mocks';
import { createGenerateTokenUserMock } from '../../token/mocks';

describe('SignInUserUseCase', () => {
  let useCase: SignInUserUseCase;

  const passwordHashServiceMock = createPasswordHashServiceMock();

  const generateTokenUserMock = createGenerateTokenUserMock();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...ConfigMock,
        WordDataModule,
        UserFavoriteWordsDataModule,
        UserDataModule,
      ],
      providers: [
        SignInUserUseCase,
        { provide: IPasswordHashService, useValue: passwordHashServiceMock },
        { provide: IGenerateTokenUser, useValue: generateTokenUserMock },
      ],
    }).compile();

    useCase = module.get(SignInUserUseCase);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('must be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('must authenticate successfully and return token', async () => {
    let createdUser: any;
    createdUser = await createUserResponse({ password: '123456' });
    passwordHashServiceMock.comparePassword.mockResolvedValue(true);
    generateTokenUserMock.generateToken.mockResolvedValue({
      token: 'jwt-token',
    });

    const result = await useCase.execute({
      email: createdUser.email,
      password: '123456',
    });

    expect(passwordHashServiceMock.comparePassword).toHaveBeenCalledWith(
      '123456',
      createdUser.password,
    );
    expect(generateTokenUserMock.generateToken).toHaveBeenCalledWith({
      userId: createdUser.id,
      email: createdUser.email,
    });

    expect(result).toEqual({
      id: createdUser.id,
      name: createdUser.name,
      token: 'jwt-token',
    });
  });

  it('should throw Unauthorized if user does not exist', async () => {
    await expect(
      useCase.execute({ email: 'x@x.com', password: 'whatever' }),
    ).rejects.toThrow(UnauthorizedException);

    try {
      await useCase.execute({ email: 'x@x.com', password: 'whatever' });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.response?.errorDefinition).toBe(
        ErrorDefinitions.USER_NOT_FOUND_OR_PASSWORD,
      );
    }
  });

  it('should throw Unauthorized if password is invalid', async () => {
    passwordHashServiceMock.comparePassword.mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'john@doe.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);

    try {
      await useCase.execute({ email: 'john@doe.com', password: 'wrong' });
    } catch (error) {
      expect(error.response?.errorDefinition).toBe(
        ErrorDefinitions.USER_NOT_FOUND_OR_PASSWORD,
      );
    }
  });
});
