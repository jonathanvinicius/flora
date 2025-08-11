import { Module } from '@nestjs/common';
import { ExceptionsService } from './exception.service';

@Module({
  providers: [ExceptionsService],
  exports: [ExceptionsService],
})
export class ExceptionModule {}
