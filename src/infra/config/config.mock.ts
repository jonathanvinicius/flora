import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { loadConfig } from './load.config';
import { JwtModule } from '@nestjs/jwt';
import { IJWTConfig } from '../interfaces';
import { SequelizeTestFactory } from '../providers';
loadConfig();
//or over your env
process.env.NODE_ENV = 'test';
//set port for test
process.env.PORT = '4447';

//Default config for test
export const ConfigMock = [
  //Config module
  ConfigModule.forRoot({
    load: [async () => loadConfig()],
    isGlobal: true,
  }),
  SequelizeModule.forRootAsync({
    useClass: SequelizeTestFactory,
  }),
  //auth
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

  //Http request
  HttpModule.register({ timeout: 60000 }),
];
