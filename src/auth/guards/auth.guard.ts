import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, first } from 'rxjs';
import { JwtPayload } from 'src/interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

constructor(private jwtService: JwtService,
            private authService:AuthService){

}
 async canActivate(context: ExecutionContext):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No hay token en la peticion');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,{secret: process.env.JWT_SEED}
      );
      
      const user = await this.authService.findUserbyId(payload.id);
      if(!user) throw new UnauthorizedException('User no existe');
      if(!user.isActivate) throw new UnauthorizedException('User no esta activo');
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
 


    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}