import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongodb'
import { Document, WithId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    const data = await accountCollection.findOne({ _id: result.insertedId })
    if (!data) {
      throw new Error('Account failed on register at database')
    }
    return this.convert(data)
  }

  private convert (data: WithId<Document>): AccountModel {
    const { _id, ...accountWithouId } = data
    return Object.assign({}, accountWithouId, { id: _id.toString() }) as unknown as AccountModel
  }
}
