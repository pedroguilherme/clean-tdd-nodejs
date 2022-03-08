import { BcryptAdapter } from '@/infra/criptography/bcrypt/bcrypt-adapter'
import env from '@/main/config/env'

export const makeBcryptAdapter = (): BcryptAdapter => {
  return new BcryptAdapter(env.salt)
}
