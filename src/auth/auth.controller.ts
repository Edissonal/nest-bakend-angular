import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { LoginDto,CreateUserDto, RegisterUserDto, UpdateAuthDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from 'src/interfaces/login-response';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    console.log(CreateUserDto);
    return this.authService.create(CreateUserDto);
  }

  @Post('/login')
  login(@Body() LoginDto:LoginDto){
    return this.authService.login(LoginDto)
  }

  @Post('/register')
  reister(@Body() registerDto:RegisterUserDto){
    return this.authService.register(registerDto)
  }


  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request()req:Request) {
    const user = req['user'];
     return user;
    // return this.authService.findAll();
  }

  //login response
  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req:Request):LoginResponse{
 //   return 'Hola mundo'
  const user = req['user'] as User

  return {
    user,
    token:this.authService.getjwtToken({id:user})
  }
  }

  /*@Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }*/
}
