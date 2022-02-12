import { JwtAdapter } from '../../../infra/criptography/jwt/jwt-adapter'

export const makeJwtAdapter = (): JwtAdapter => {
  const secret = 'secret_key'
  return new JwtAdapter(secret)
}
