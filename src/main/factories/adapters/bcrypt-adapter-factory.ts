import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt-adapter'

export const makeBcryptAdapter = (): BcryptAdapter => {
  const salt = 12
  return new BcryptAdapter(salt)
}
