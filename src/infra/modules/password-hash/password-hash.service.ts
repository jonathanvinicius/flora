import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { IPasswordHashService } from './password-hash.service.interface';
import { IJWTConfig } from '@app/infra/interfaces';

@Injectable()
export class PasswordHashService implements IPasswordHashService {
  constructor(private readonly configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const config = this.configService.get<IJWTConfig>('jwt');
    const saltRounds = Number(config.saltRounds) || 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
