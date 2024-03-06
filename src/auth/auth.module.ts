import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
  ConfigModule.forRoot(),
  JwtModule.register({
    global: true,
    secret: process.env.JWT_SEED,
    signOptions: { expiresIn: '60s' },
  }),  
  MongooseModule.forFeature([{
    name:User.name,
    schema:UserSchema
  }])
  ]
})
export class AuthModule {}
