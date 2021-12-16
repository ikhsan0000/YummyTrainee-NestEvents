import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entitied/subject.entity';
import { Teacher } from './entitied/teacher.entity';
import { TrainingController } from "./training.controller";
import { SchoolService } from './school.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  controllers: [TrainingController],
  providers: [SchoolService]
})
export class SchoolModule { }