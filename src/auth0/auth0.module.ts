import { Module } from '@nestjs/common';
import { AuthController } from './auth0.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    ConfigModule.forRoot(),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
