import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { ClassesModule } from './modules/classes/classes.module';
import { RolesModule } from './modules/roles/roles.module';
import typeorm from './config/typeorm';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { TeacherClassesModule } from './modules/teacherClass/teacherClasses.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
ConfigModule.forRoot({
  isGlobal: true,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    UsersModule,
    ClassesModule,
    RolesModule,
    AssignmentsModule,
    TeacherClassesModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
