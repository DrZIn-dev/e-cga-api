import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from 'src/auth/auth.service'
import { UserEntity } from '../entity/user/user.entity'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
    })
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    return this.authService.validateUser({ username, password })
  }
}
