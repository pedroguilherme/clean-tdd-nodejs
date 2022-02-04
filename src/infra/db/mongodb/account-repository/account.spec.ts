import { AddAccountModel } from '../../../../domain/usecases/add-account'
import faker from '@faker-js/faker'
import { MongoHelper } from '../helpers/mongodb'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', function () {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const addAccountModel: AddAccountModel = {
      name: faker.name.firstName(),
      email: faker.internet.exampleEmail(),
      password: faker.internet.password()
    }

    const account = await sut.add(addAccountModel)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(addAccountModel.name)
    expect(account.email).toBe(addAccountModel.email)
    expect(account.password).toBe(addAccountModel.password)
  })
})
