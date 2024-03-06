import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces/jwt-payload';
import { LoginResponse } from 'src/interfaces/login-response';
import { RegisterUserDto,UpdateAuthDto,CreateUserDto } from './dto';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectModel(User.name)
    private userModel:Model<User>,
    private jwtService: JwtService,
    ){

  }

async  create(CreateUserDto: CreateUserDto):Promise<User> {
   // const newUser = new this.userModel(CreateUserDto);
    //return newUser.save();
    
    try {

      const {password,...userData} = CreateUserDto;
      const newUser = new this.userModel({
          password:bcryptjs.hashSync(password,10),
          ...userData
      });

      await newUser.save();
      const {password:_,...user} = newUser.toJSON()

      return user
      
      
    } catch (error) {
      console.log(error.code);
     if(error.code === 11000){
      throw new BadRequestException(`${CreateUserDto.email} al ready exists`)
      }
      throw new InternalServerErrorException('Someting terrible happen')
    }

  }

  findAll():Promise<User[]> {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

async register(registerDto:RegisterUserDto):Promise<LoginResponse>{

  const user = await this.create(registerDto);
  console.log({user})
  return{
    user:user,
    token:this.getjwtToken({id:user._id})
  
  }

}


async  login(LoginDto:LoginDto):Promise<LoginResponse>{
    const {email,password} = LoginDto;

    const user = await this.userModel.findOne({email});

    if(!user){
    throw new UnauthorizedException('Not valid credentials -email');
    }

    if(!bcryptjs.compareSync(password,user.password)){
      throw new UnauthorizedException('Not valid credentials -password');
    }

    const {password:_,...rest} = user.toJSON();
    return{
        user:rest,
        token:this.getjwtToken({id:user.id})
    };
  }

  getjwtToken(payload:any ){
    const token = this.jwtService.sign(payload);
    return token 
  }

 async  findUserbyId(id:string){
  const user = await this.userModel.findById(id);
  const{password,...rest} = user.toJSON();
   return rest;
  }
}
