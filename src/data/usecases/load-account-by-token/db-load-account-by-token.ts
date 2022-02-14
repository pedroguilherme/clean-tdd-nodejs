import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {
  }

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return await new Promise(resolve => resolve({
      id: 'valid_id',
      email: 'valid_email',
      name: 'valid_name',
      password: 'hashed_password'
    }))
  }
}
