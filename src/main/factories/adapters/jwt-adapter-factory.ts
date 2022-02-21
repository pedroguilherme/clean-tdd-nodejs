import { JwtAdapter } from '../../../infra/criptography/jwt/jwt-adapter'
import env from '../../config/env'

export const makeJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecret)
}
