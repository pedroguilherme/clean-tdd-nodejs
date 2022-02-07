import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { HashComparer } from '../../protocols/criptography/hash-comparer'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {
  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) {
      return await new Promise(resolve => resolve(null))
    }
    await this.hashComparer.compare(authentication.password, account.password)
    return await new Promise(resolve => resolve(null))
  }
}
