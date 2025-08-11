import { Module } from '@nestjs/common';
import { IPasswordHashService } from './password-hash.service.interface';
import { PasswordHashService } from './password-hash.service';

@Module({
  providers: [
    {
      provide: IPasswordHashService,
      useClass: PasswordHashService,
    },
  ],
  exports: [IPasswordHashService],
})
export class PasswordHashModule {}
