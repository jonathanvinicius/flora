import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IAuthService } from './auth.service.interface';
import { AccessTokenStrategy } from './strategies/jwt.strategy';
import { PasswordHashModule } from '@app/infra/modules/password-hash/password-hash.module';
import { IJWTConfig } from '@app/infra/interfaces';
import { SignInUserUseCase, SignUpUserUseCase } from './usecases';
import { UserDataModule } from '@app/infra/database/contexts';
import { GenerateTokenUser } from './token/generate-token-user';
import { IGenerateTokenUser } from './token/generate-token-user.inteface';

@Module({
  controllers: [AuthController],
  imports: [
    PasswordHashModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const jwt = configService.get<IJWTConfig>('jwt');
        return {
          secret: jwt.secretKey,
          signOptions: {
            expiresIn: jwt.expiresIn,
          },
        };
      },
    }),
    UserDataModule,
  ],
  providers: [
    AccessTokenStrategy,
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    SignInUserUseCase,
    SignUpUserUseCase,
    {
      provide: IGenerateTokenUser,
      useClass: GenerateTokenUser,
    },
  ],
  exports: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
