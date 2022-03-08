import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter'
import env from '@/main/config/env'

export const makeJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecret)
}
