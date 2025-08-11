import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

@Injectable()
export class SequelizePostgresFactory implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'postgres',
      host: this.configService.get<string>('db.host'),
      port: Number(this.configService.get<string>('db.port')),
      username: this.configService.get<string>('db.user'),
      password: this.configService.get<string>('db.password'),
      database: this.configService.get<string>('db.name'),
      autoLoadModels: true,
      synchronize: false,
      quoteIdentifiers: false,
      define: {
        freezeTableName: true,
      },
      dialectOptions: {
        decimalNumbers: true,
      },
      logging: false,
    };
  }
}
