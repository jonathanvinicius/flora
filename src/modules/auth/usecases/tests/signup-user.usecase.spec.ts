import { Test, TestingModule } from '@nestjs/testing';
import { ConfigMock } from '@app/infra/config/config.mock';
import { UserDataModule } from '@app/infra/database/contexts';
import { createUserResponse } from '@app/infra/database/contexts/relational/_fakers_';
import { ErrorDefinitions } from '@app/domain/errors';
import { SignUpUserUseCase } from '../signup-user.usecase';
import { WordDataModule } from '@app/infra/database/contexts/relational/words';
import { UserFavoriteWordsDataModule } from '@app/infra/database/contexts/relational/user-favorite-words';
import { IPasswordHashService } from '@app/infra/modules/password-hash/password-hash.service.interface';
import { IGenerateTokenUser } from '../../token/generate-token-user.inteface';
import { createPasswordHashServiceMock } from '@app/infra/modules/password-hash/mocks';
import { createGenerateTokenUserMock } from '../../token/mocks';

describe('SignUpUserUseCase', () => {
  let useCase: SignUpUserUseCase;

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
        SignUpUserUseCase,
        { provide: IPasswordHashService, useValue: passwordHashServiceMock },
        { provide: IGenerateTokenUser, useValue: generateTokenUserMock },
      ],
    }).compile();

    useCase = module.get<SignUpUserUseCase>(SignUpUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign up successfully and return token', async () => {
    passwordHashServiceMock.hashPassword.mockResolvedValue('hashed');

    generateTokenUserMock.generateToken.mockResolvedValue({
      token: 'jwt-token',
    });

    const result = await useCase.execute({
      name: 'John doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(passwordHashServiceMock.hashPassword).toHaveBeenCalledWith('123456');
    expect(generateTokenUserMock.generateToken).toHaveBeenCalledWith({
      userId: result.id,
      email: 'johndoe@gmail.com',
    });
    expect(result).toEqual({
      id: result.id,
      name: result.name,
      token: 'jwt-token',
    });
  });

  it('should throw error if user already exists', async () => {
    let existingUser: any;

    existingUser = await createUserResponse();

    await expect(
      useCase.execute({
        name: existingUser.name,
        email: existingUser.email,
        password: '123456',
      }),
    ).rejects.toMatchObject({
      response: { errorDefinition: ErrorDefinitions.USER_EXISTS },
    });
  });
});
