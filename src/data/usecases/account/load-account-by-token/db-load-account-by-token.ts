import { LoadAccountByToken } from '../../../../domain/usecases/account/load-account-by-token'
import { AccountModel } from '../../../../domain/models/account'
import { Decrypter } from '../../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../../protocols/db/account/load-account-by-token-repository'

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

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)

    if (!account) {
      return null
    }

    return account
  }
}
