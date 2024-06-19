import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { ClassesModule } from '../classes/classes.module';
import { JwtModule } from '@nestjs/jwt';

const TOKEN_SECRET = process.env.TOKEN_SECRET;
//TODO:

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    forwardRef(() => ClassesModule), //to avoid circular dependency
    JwtModule.register({
      global: true,
      secret: TOKEN_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
