import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {
  }

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    const isValidToken = await this.decrypter.decrypt(accessToken)
    if (!isValidToken) {
      return null
    }

    await this.loadAccountByTokenRepository.loadByToken(accessToken, role)

    return {
      id: 'valid_id',
      email: 'valid_email',
      name: 'valid_name',
      password: 'hashed_password'
    }
  }
}
