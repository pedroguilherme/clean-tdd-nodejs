import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account-exp'
import { LoadAccountByEmailRepository } from '../../../protocols/db/account/load-account-by-email-repository'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account) {
      return null
    }
    const hashedPassword = await this.hasher.hash(accountData.password)
    return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
  }
}
