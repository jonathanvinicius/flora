import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IWORD_REPOSITORY } from '@app/domain';
import { WordModel } from './model/word.model';
import { WordRepository } from './repository/word.repository';

@Module({
  imports: [SequelizeModule.forFeature([WordModel])],
  providers: [
    {
      provide: IWORD_REPOSITORY,
      useClass: WordRepository,
    },
  ],
  exports: [IWORD_REPOSITORY],
})
export class WordDataModule {}
